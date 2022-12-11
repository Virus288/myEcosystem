import { describe, expect, it } from '@jest/globals';
import Validation from '../../src/validation';
import * as errors from '../../src/errors';
import * as types from '../../src/types';

describe('Login', () => {
  const login: types.ILoginReq = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {
      Object.keys(login).forEach((k) => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];
          const func = () => Validation.validateLogin('2', clone);

          expect(func).toThrow(new errors.IncorrectCredentials('2', `${k} missing`));
        });
      });
    });
  });

  // describe('Should pass', () => {});
});
