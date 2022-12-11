import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import * as types from '../../src/types';
import { IFullError } from '../../src/types';
import * as localTypes from '../types';
import supertest from 'supertest';
import fakeData from '../fakeData.json';
import Utils from '../utils';
import Router from '../../src/router';

describe('Login', () => {
  const loginData: types.ILoginReq = fakeData.users[0];
  let utils: Utils;
  const router = new Router();

  beforeAll(async () => {
    utils = new Utils();
    await utils.init();
    router.init();
  });

  afterAll(() => {
    utils.close();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Missing login`, async () => {
        const clone = structuredClone(loginData);
        delete clone.login;

        const res = await supertest(router.app).post('/system/users/login').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('login not provided');
        expect(body.code).not.toBeUndefined();
      });

      it(`Missing login`, async () => {
        const clone = structuredClone(loginData);
        delete clone.password;

        const res = await supertest(router.app).post('/system/users/login').send(clone);
        const body = res.body as IFullError;

        expect(body.message).toEqual('password not provided');
        expect(body.code).not.toBeUndefined();
      });
    });

    describe('Incorrect data', () => {
      it(`Incorrect login`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/login')
          .send({ ...loginData, login: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect login or password');
        expect(body.code).not.toBeUndefined();
      });

      it(`Incorrect password`, async () => {
        const res = await supertest(router.app)
          .post('/system/users/login')
          .send({ ...loginData, password: 'abc' });
        const body = res.body as IFullError;

        expect(body.message).toEqual('Incorrect login or password');
        expect(body.code).not.toBeUndefined();
      });
    });
  });

  describe('Should pass', () => {
    it(`Validated login`, async () => {
      const res = await supertest(router.app).post('/system/users/login').send(loginData);
      const body = res.body as localTypes.ILoginSuccessResponse;

      expect(body.refreshToken).not.toEqual(undefined);
      expect(body.eol).not.toBeLessThan(Date.now());
    });
  });
});
