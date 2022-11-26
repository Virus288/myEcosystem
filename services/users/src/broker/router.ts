import type * as types from '../types';
import * as enums from '../enums';
import Controller from '../modules/controller';
import * as errors from '../errors';

export default class Router {
  controller: Controller;

  constructor() {
    this.controller = new Controller();
  }

  async handleMessage(payload: types.IRabbitMessage): Promise<void> {
    switch (payload.target) {
      case enums.EUserTargets.Login:
        return await this.controller.login(payload.payload as types.ILoginReq, payload.user);
      case enums.EUserTargets.Register:
        return await this.controller.register(payload.payload as types.IRegisterReq, payload.user);
      default:
        throw new errors.WrongType(payload.user.tempId);
    }
  }
}
