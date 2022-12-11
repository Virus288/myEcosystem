import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Database from '../utils/mockDB';
import Rooster from '../../src/modules/rooster';
import * as enums from '../../src/enums';
import * as types from '../../src/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fakeData from '../utils/fakeData.json';
import mongoose from 'mongoose';

describe('Login', () => {
  const loginData: types.IRegisterReq = fakeData.users[0];

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
      const user = await rooster.getByLogin(loginData.login);

      expect(user).toEqual([]);
    });

    it('Incorrect target', async () => {
      const db = new Database();
      await db.user.login(loginData.login).password(loginData.password).email(loginData.email).verified(false).create();

      const rooster = new Rooster();
      const user = await rooster.getByLogin('a');
      await db.cleanUp();

      expect(user).toEqual([]);
    });
  });

  describe('Should pass', () => {
    it(`Validated`, async () => {
      const db = new Database();
      await db.user.login(loginData.login).password(loginData.password).email(loginData.email).verified(false).create();

      const rooster = new Rooster();
      const user = await rooster.getByEmail(loginData.email);
      const { login, password, email, verified, _id, type } = user[0];
      await db.cleanUp();

      expect(login).toEqual(loginData.login);
      expect(password.length).not.toBeLessThan(loginData.password.length);
      expect(email).toEqual(loginData.email);
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
