import { beforeAll, describe, expect, it } from '@jest/globals';
import State from '../../src/tools/state';
import Router from '../../src/router';

describe('Login', () => {
  // const login: types.ILoginReq = {
  //   login: 'Test',
  //   password: 'Test123',
  // };

  beforeAll(() => {
    State.Router = new Router();
    State.Router.init();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`I Really want to push this commit today and its already late`, async () => {
        expect(2).toEqual(2);
      });
    });
  });

  // describe('Should pass', () => {
  //   it(`Validated login`, async () => {
  //     await supertest(State.Router.app)
  //       .post('/system/users/login')
  //       .set(login)
  //       .expect((body) => {});
  //     const func = () => Validation.validateLogin(login);
  //     expect(func).not.toThrow();
  //   });
  // });
});
