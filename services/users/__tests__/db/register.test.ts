import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Database from '../utils/mockDB';
import Rooster from '../../src/modules/rooster';
import * as enums from '../../src/enums';
import * as types from '../../src/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fakeData from '../utils/fakeData.json';

describe('Register', () => {
  const registerData: types.IRegisterReq = fakeData.users[0];

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    it('No data in database', async () => {
      const rooster = new Rooster();
      const user = await rooster.getByEmail(registerData.email);

      expect(user).toEqual([]);
    });

    it('Incorrect target', async () => {
      const db = new Database();
      await db.user
        .login(registerData.login)
        .password(registerData.password)
        .email(registerData.email)
        .verified(false)
        .create();

      const rooster = new Rooster();
      const user = await rooster.getByLogin('a');

      expect(user).toEqual([]);
      await db.cleanUp();
    });
  });

  describe('Should pass', () => {
    it(`Validated`, async () => {
      const rooster = new Rooster();
      await rooster.add(registerData);
      const user = await rooster.getByLogin(registerData.login);
      const { login, password, email, verified, _id, type } = user[0];

      expect(login).toEqual(registerData.login);
      expect(password.length).not.toBeLessThan(registerData.password.length);
      expect(email).toEqual(registerData.email);
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
