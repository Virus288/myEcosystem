import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as types from '../../src/types';
import * as errors from '../../src/errors';
import * as enums from '../../src/enums';
import Controller from '../../src/modules/controller';
import Database from '../utils/mockDB';
import fakeData from '../utils/fakeData.json';

describe('Login', () => {
  const loginData: types.ILoginReq = fakeData.users[0];
  const localUser: types.ILocalUser = {
    userId: undefined,
    tempId: 'tempId',
    validated: true,
    type: enums.EUserTypes.User,
  };
  const controller = new Controller();

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
      it(`Missing login`, () => {
        const clone = structuredClone(loginData);
        delete clone.login;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });

      it(`Missing password`, () => {
        const clone = structuredClone(loginData);
        delete clone.password;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });
    });

    describe('Incorrect data', () => {
      const db = new Database();

      beforeEach(async () => {
        await db.user
          .login(loginData.login)
          .password(loginData.password)
          .email('test@test.test')
          .verified(false)
          .create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Login incorrect`, () => {
        controller.login({ ...loginData, login: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });

      it(`Password incorrect`, () => {
        controller.login({ ...loginData, password: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated`, async () => {
      const db = new Database();
      await db.user
        .login(loginData.login)
        .password(loginData.password)
        .email('test@test.test')
        .verified(false)
        .create();

      const { userId, refreshToken, mainToken } = await controller.login(loginData, localUser);
      expect(userId).not.toBeUndefined();
      expect(userId.length).not.toBeLessThan(10);
      expect(refreshToken).not.toBeUndefined();
      expect(refreshToken.length).not.toBeLessThan(20);
      expect(mainToken).not.toBeUndefined();
      expect(mainToken.length).not.toBeLessThan(20);

      await db.cleanUp();
    });
  });
});
