import User from './model';
import type * as types from '../types';

export default class Rooster {
  async add(userData: { login: string; email: string; password: string }): Promise<void> {
    const NewUser = new User(userData);
    await NewUser.save();
  }

  async get(data: string): Promise<types.IUser[]> {
    return User.find({ $or: [{ login: data }, { email: data }] });
  }

  async getByEmail(data: string): Promise<types.IUser[]> {
    return User.find({ email: data });
  }

  async getByLogin(data: string): Promise<types.IUser[]> {
    return User.find({ login: data });
  }
}
