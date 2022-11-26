import User from './model';
import type * as types from '../types';

export default class Rooster {
  async add(userData: { login: string; email: string; password: string }): Promise<void> {
    const NewUser = new User(userData);
    await NewUser.save();
  }

  async get(login: string): Promise<types.IUser[]> {
    return User.find({ login });
  }
}
