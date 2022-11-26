import { describe, expect, it } from '@jest/globals';
import Validation from '../../../src/validation';
import * as types from '../../../src/types';

describe('Login', () => {
  const login: types.ILoginReq = {
    login: 'Test',
    password: 'Test123',
  };

  describe('Should throw', () => {
    describe('No data passed', () => {});
  });

  describe('Should pass', () => {
    it(`Validated login`, () => {
      const func = () => Validation.validateLogin('test', login);
      expect(func).not.toThrow();
    });
  });
});
