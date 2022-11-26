import * as enums from '../enums';
import type * as types from '../types';
import amqplib from 'amqplib';
import getConfig from '../tools/configLoader';
import Controller from './controller';
import { FullError, InternalError } from '../errors';
import Log from '../tools/logger/log';

export default class Broker {
  private retryTimeout: NodeJS.Timeout;
  private connection: amqplib.Connection;
  private connectionTries = 0;

  private channel: amqplib.Channel;
  private channelTries = 0;

  private services: {
    [key in types.IAvailableServices]: { timeout: NodeJS.Timeout; retries: number; dead: boolean };
  } = {
    [enums.EServices.Users]: { timeout: undefined, retries: 0, dead: true },
  };

  private controller: Controller;

  init(): void {
    this.controller = new Controller();
    this.initCommunication();
  }

  sendLocally(target: enums.EUserTargets, res: types.ILocalUser, payload: unknown, service: enums.EServices): void {
    const queue = this.services[service as types.IAvailableServices];
    if (queue.dead) return this.sendError(res, new InternalError());

    this.controller.sendLocally(target, res, payload, service, this.channel);
  }

  close(): void {
    this.connection
      .close()
      .then(() => {
        if (this.retryTimeout) clearTimeout(this.retryTimeout);
        this.cleanAll();
      })
      .catch(() => null);
  }

  private reconnect(): void {
    this.close();
    this.initCommunication();
  }

  private initCommunication(): void {
    if (this.connectionTries++ > enums.ERabbit.RetryLimit) {
      Log.error('Rabbit', 'Gave up connecting to rabbit. Is rabbit dead?');
      return;
    }

    amqplib
      .connect(getConfig().amqpURI)
      .then((connection) => {
        Log.log('Rabbit', 'Connected to rabbit');
        this.connection = connection;
        connection.on('close', () => this.close());
        connection.on('error', () => this.reconnect());
        this.createChannels();
      })
      .catch((err) => {
        Log.warn('Rabbit', 'Error connecting to RabbitMQ, retrying in 1 second');
        Log.error('Rabbit', err);
        this.retryTimeout = setTimeout(() => this.initCommunication(), 1000);
        return (this.connection = null);
      });
  }

  private createChannels(): void {
    if (this.channel) return;
    if (this.channelTries++ > enums.ERabbit.RetryLimit) {
      Log.error('Rabbit', 'Error creating rabbit connection channel, stopped retrying');
    }

    this.connection
      .createChannel()
      .then((channel) => {
        Log.log('Rabbit', 'Channel connected');
        this.channel = channel;
        channel.on('close', () => this.cleanAll());
        channel.on('error', () => this.reconnectChannel());
        return this.createQueue();
      })
      .catch((err) => {
        Log.error('Rabbit', err);
        Log.error(
          'Rabbit',
          `Error creating rabbit connection channel, retrying in 1 second: ${(err as types.IFullError).message}`,
        );
        this.retryTimeout = setTimeout(() => this.createChannels(), 1000);
        return (this.channel = null);
      });
  }

  private async createQueue(): Promise<void> {
    Log.log('Rabbit', `Creating channel: ${enums.EAmqQueues.Gateway}`);
    Log.log('Rabbit', `Creating channel: ${enums.EAmqQueues.Users}`);
    await this.channel.assertQueue(enums.EAmqQueues.Gateway, { durable: true });
    await this.channel.assertQueue(enums.EAmqQueues.Users, { durable: true });
    await this.channel.consume(
      enums.EAmqQueues.Gateway,
      (message) => {
        const payload = JSON.parse(message.content.toString()) as types.IRabbitMessage;
        if (payload.target === enums.EMessageTypes.Heartbeat) {
          this.validateHeartbeat(payload.payload as types.IAvailableServices);
        } else {
          this.errorWrapper(() => this.controller.sendExternally(payload));
        }
      },
      { noAck: true },
    );
    this.validateConnections();
  }

  private validateHeartbeat(target: types.IAvailableServices): void {
    const service = this.services[target];
    clearTimeout(service.timeout);

    if (service.dead) {
      Log.log(target, 'Resurrected');
    }

    this.services[target] = {
      ...this.services[target],
      timeout: setTimeout(() => this.checkHeartbeat(target), 30000),
      dead: false,
      retries: 0,
    };
  }

  private validateConnections(): void {
    const services = Object.entries(this.services);
    services.forEach((service) => {
      if (service[1].dead) {
        Log.log('Rabbit', 'Reviving service');
        this.retryHeartbeat(service[0] as types.IAvailableServices);
      } else {
        service[1].timeout = setTimeout(() => this.checkHeartbeat(service[0] as types.IAvailableServices), 30000);
      }
    });
  }

  private retryHeartbeat(target: types.IAvailableServices): void {
    const service = this.services[target];
    service.dead = true;
    if (service.retries >= 10) {
      Log.error(target, `Is down!. Stopped retrying after ${service.retries} tries.`);
      this.closeDeadQueue(target).catch((err) => {
        Log.error('Rabbit', "Couldn't clear queue");
        Log.error('Rabbit', err);
      });
    } else {
      Log.warn(target, `Is down!. Trying to connect for ${service.retries + 1} time.`);
      this.controller.sendHeartbeat(this.channel, target);
      service.timeout = setTimeout(() => this.retryHeartbeat(target), 5000);
      service.retries++;
    }
  }

  private checkHeartbeat(target: types.IAvailableServices): void {
    this.controller.sendHeartbeat(this.channel, target);
    this.services[target].timeout = setTimeout(() => this.retryHeartbeat(target), 5000);
  }

  private closeDeadQueue = async (target: types.IAvailableServices): Promise<void> => {
    switch (target) {
      case enums.EServices.Users:
        await this.channel.purgeQueue(enums.EAmqQueues.Users);
        break;
    }
    return this.controller.fulfillDeadQueue(target);
  };

  private async closeChannel(): Promise<void> {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    await this.channel.purgeQueue(enums.EAmqQueues.Gateway);
    await this.channel.purgeQueue(enums.EAmqQueues.Users);

    await this.channel.deleteQueue(enums.EAmqQueues.Gateway);
    await this.channel.deleteQueue(enums.EAmqQueues.Users);

    await this.channel.close().catch(() => null);
    this.channel = null;
    this.channelTries = 0;
  }

  private reconnectChannel(): void {
    Log.error('Rabbit', 'Got err. Reconnecting');
    this.closeChannel()
      .then(() => {
        this.createChannels();
      })
      .catch((err) => {
        Log.error('Rabbit', "Couldn't create channels");
        Log.error('Rabbit', err);
      });
  }

  private cleanAll(): void {
    this.channel = null;
    this.connection = null;
    this.connectionTries = 0;
    this.channelTries = 0;
    clearTimeout(this.retryTimeout);
  }

  private sendError(user: types.ILocalUser, error: FullError): void {
    const { message, code, name, status } = error;
    user.status(status).send(JSON.stringify({ message, code, name }));
  }

  private errorWrapper(func: () => void): void {
    try {
      func();
    } catch (err) {
      Log.error('Rabbit', err);
    }
  }
}
