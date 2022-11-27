import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import Database from '../mockDB';
import Rooster from '../../src/modules/rooster';
import * as enums from '../../src/enums';
import * as types from '../../src/types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('Login', () => {
  const loginData: types.ILoginReq = {
    login: 'Test',
    password: 'Test123',
  };

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      // Pass no data. Check how mongoDB will respond
    });

    describe('Incorrect data', () => {
      // Pass incorrect type of data. Check how mongoDB will respond
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, async () => {
      const db = new Database();
      await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email('test@test.test')
        .verified(false)
        .create();

      const rooster = new Rooster();
      const user = await rooster.get(loginData.login);
      const { login, password, email, verified, _id, type } = user[0];

      expect(login).toEqual(loginData.login);
      expect(password.length).not.toBeLessThan(loginData.password.length);
      expect(email).toEqual('test@test.test');
      expect(verified).toEqual(false);
      expect(_id).not.toBeUndefined();
      expect(type).toEqual(enums.EUserTypes.User);
    });
  });
});
