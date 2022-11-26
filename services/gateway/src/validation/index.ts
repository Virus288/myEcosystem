import type * as types from '../types';
import * as errors from '../errors';

export default class Validator {
  static validateLogin(data: types.ILoginReq): void {
    const { password, login } = data;

    if (!password) throw new errors.NoDataProvided('password');
    if (!login) throw new errors.NoDataProvided('login');
  }

  static validateRegister(data: types.IRegisterReq): void {
    const { password2, email } = data;
    this.validateLogin(data);

    if (!password2) throw new errors.NoDataProvided('password2');
    if (!email) throw new errors.NoDataProvided('email');
  }
}
