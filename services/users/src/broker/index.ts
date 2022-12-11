import * as enums from '../enums';
import type * as types from '../types';
import amqplib from 'amqplib';
import getConfig from '../tools/configLoader';
import { FullError } from '../errors';
import Log from '../tools/logger/log';
import Router from './router';

export default class Broker {
  private retryTimeout: NodeJS.Timeout;
  private connection: amqplib.Connection;
  private connectionTries = 0;

  private channel: amqplib.Channel;
  private channelTries = 0;
  private queue: Record<string, types.IRabbitMessage> = {};

  private router: Router;

  init(): void {
    this.router = new Router();
    this.initCommunication();
  }

  send(userId: string, payload: unknown, target: enums.EMessageTypes): void {
    const body = { ...this.queue[userId], payload, target };
    delete this.queue[userId];
    this.channel.sendToQueue(enums.EAmqQueues.Gateway, Buffer.from(JSON.stringify(body)));
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
      enums.EAmqQueues.Users,
      (message) => {
        const payload = JSON.parse(message.content.toString()) as types.IRabbitMessage;
        if (payload.target === enums.EMessageTypes.Heartbeat) {
          return this.send(undefined, enums.EServices.Users, enums.EMessageTypes.Heartbeat);
        } else {
          this.queue[payload.user.userId ?? payload.user.tempId] = payload;
          this.errorWrapper(
            async () => await this.router.handleMessage(payload),
            payload.user.userId ?? payload.user.tempId,
          );
        }
      },
      { noAck: true },
    );
    return this.send(undefined, enums.EServices.Users, enums.EMessageTypes.Heartbeat);
  }

  private async closeChannel(): Promise<void> {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    await this.channel.purgeQueue(enums.EAmqQueues.Users);
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

  private errorWrapper(func: () => Promise<void>, user: string): void {
    func().catch((err) => {
      const { userId, message, name, code, status } = err as FullError;
      if (!status) {
        this.send(userId ?? user, { message, name, code, status: 500 }, enums.EMessageTypes.Error);
      } else {
        this.send(userId ?? user, { message, name, code, status }, enums.EMessageTypes.Error);
      }
    });
  }
}
