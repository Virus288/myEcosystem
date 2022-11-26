import { describe, expect, it } from "@jest/globals";
import Validation from "../../../src/validation";
import * as types from "../../../src/types";
import * as errors from "../../../src/errors";

describe("Register", () => {
  const register: types.IRegisterReq = {
    login: "Test",
    password: "Test123",
    password2: "Test123",
    email: "test@test.test"
  };

  describe("Should throw", () => {
    describe("No data passed", () => {
      Object.keys(register).forEach(k => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(register);
          delete clone[k];
          const func = () => Validation.validateRegister(clone);

          expect(func).toThrow(new errors.NoDataProvided(k));
        });
      });
    });
  });

  describe("Should pass", () => {
    it(`Validated registry`, () => {
      const func = () => Validation.validateRegister(register);
      expect(func).not.toThrow();
    });
  });
});
