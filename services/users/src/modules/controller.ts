import type * as types from '../types';
import Rooster from './rooster';
import * as errors from '../errors';
import State from '../tools/state';
import * as enums from '../enums';
import Validator from '../validation';
import * as utils from '../tools/token';

export default class Controller {
  private rooster: Rooster;

  constructor() {
    this.rooster = new Rooster();
  }

  async login(payload: types.ILoginReq, user: types.ILocalUser): Promise<void> {
    Validator.validateLogin(user.tempId, payload);

    const { login, password } = payload;
    const users = await this.rooster.get(login);
    if (!users || users.length === 0) throw new errors.UserDoesNotExist(user.tempId);

    const target = users[0];
    await Validator.compare(user.tempId, password, target.password);

    const mainToken = utils.generateMainToken(target._id.toString(), target.type);
    const refreshToken = utils.generateRefreshToken(target._id.toString(), target.type);

    const body: types.IUserCredentials = {
      mainToken: mainToken,
      refreshToken: refreshToken,
      userId: target._id.toString(),
    };
    return State.Broker.send(user.tempId, body, enums.EMessageTypes.Credentials);
  }

  async register(payload: types.IRegisterReq, user: types.ILocalUser): Promise<void> {
    Validator.validateRegister(user.tempId, payload);

    const { email, password } = payload;
    const users = await this.rooster.get(email);
    if (users && users.length > 0) throw new errors.UserAlreadyRegistered(user.tempId);

    const hashed = await utils.hashPassword(password);

    await this.rooster.add({ ...payload, password: hashed });
    return State.Broker.send(user.tempId, undefined, enums.EMessageTypes.Send);
  }
}
