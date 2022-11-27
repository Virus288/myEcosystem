import bcrypt from 'bcrypt';
import type * as types from '../types';
import * as errors from '../errors';

export default class Validator {
  static validateRegister(tempId: string, data: types.IRegisterReq): void {
    Validator.validateEmail(tempId, data.email?.trim());
    Validator.validatePasswords(tempId, data.password, data.password2);
    Validator.validateUserName(tempId, data.login?.trim());
  }

  static validateLogin(tempId: string, data: types.ILoginReq): void {
    Validator.validateUserName(tempId, data.login);
    Validator.validatePassword(tempId, data.password);
  }

  static validateEmail(tempId: string, email: string): void {
    const regex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    const isEmail = regex.test(email);

    if (!isEmail) throw new errors.IncorrectCredentials(tempId, 'Not valid email address');
  }

  static validatePasswords(tempId: string, password: string, password2?: string): void {
    Validator.validatePassword(tempId, password);
    if (password !== password2) throw new errors.IncorrectCredentials(tempId, 'Passwords not the same');
  }

  static validatePassword(tempId: string, password: string): void {
    const regex = new RegExp(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/);
    const isPassword = regex.test(password);

    if (password.length < 6)
      throw new errors.IncorrectCredentials(tempId, 'Password should be at least 6 characters long');
    if (password.length > 200) {
      throw new errors.IncorrectCredentials(tempId, 'Password should be less than 200 characters');
    }
    if (!isPassword) {
      throw new errors.IncorrectCredentials(
        tempId,
        'Password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
      );
    }
  }

  static validateUserName(tempId: string, name: string): void {
    const regex = new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/);
    const isIncorrect = regex.test(name);

    if (!isIncorrect)
      throw new errors.IncorrectCredentials(
        tempId,
        'Name should only contain arabic letters, numbers and special characters',
      );
    if (name.length < 3) throw new errors.IncorrectCredentials(tempId, 'Name should be at least 3 characters');
    if (name.length > 30) throw new errors.IncorrectCredentials(tempId, 'Name should be less than 30 characters');
  }

  static async compare(tempId: string, password: string, hashed: string): Promise<void> {
    const auth = await bcrypt.compare(password, hashed);
    if (!auth) throw new errors.IncorrectLogin(tempId);
  }
}
