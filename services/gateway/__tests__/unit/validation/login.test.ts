import { describe, expect, it } from "@jest/globals";
import Validation from "../../../src/validation";
import * as types from "../../../src/types";
import * as errors from "../../../src/errors";

describe("Login", () => {
  const login: types.ILoginReq = {
    login: "Test",
    password: "Test123"
  };

  describe("Should throw", () => {
    describe("No data passed", () => {
      Object.keys(login).forEach(k => {
        return it(`Missing ${k}`, () => {
          const clone = structuredClone(login);
          delete clone[k];
          const func = () => Validation.validateLogin(clone);

          expect(func).toThrow(new errors.NoDataProvided(k));
        });
      });
    });
  });

  describe("Should pass", () => {
    it(`Validated login`, () => {
      const func = () => Validation.validateLogin(login);
      expect(func).not.toThrow();
    });
  });
});
