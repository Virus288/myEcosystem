import type * as types from '../types';
import * as enums from '../enums';
import Controller from '../modules/controller';
import * as errors from '../errors';
import State from '../tools/state';

export default class Router {
  private controller: Controller;

  constructor() {
    this.controller = new Controller();
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EUserTargets.Login:
        return await this.login(payload.payload, payload.user);
      case enums.EUserTargets.Register:
        return await this.register(payload.payload, payload.user);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }

  private async login(payload: unknown, user: types.ILocalUser): Promise<void> {
    const data = await this.controller.login(payload as types.ILoginReq, user);
    return State.Broker.send(user.tempId, data, enums.EMessageTypes.Credentials);
  }

  private async register(payload: unknown, user: types.ILocalUser): Promise<void> {
    await this.controller.register(payload as types.IRegisterReq, user);
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
