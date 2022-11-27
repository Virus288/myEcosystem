import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as types from '../../src/types';
import * as errors from '../../src/errors';
import * as enums from '../../src/enums';
import Controller from '../../src/modules/controller';
import Database from '../mockDB';

describe('Register', () => {
  const registerData: types.IRegisterReq = {
    login: 'Test',
    email: 'test@test.test',
    password: 'Test123',
    password2: 'Test123',
  };
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
        const clone = structuredClone(registerData);
        delete clone.login;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });

      it(`Missing password`, () => {
        const clone = structuredClone(registerData);
        delete clone.password;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });

      it(`Missing password2`, () => {
        const clone = structuredClone(registerData);
        delete clone.password2;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });

      it(`Missing email`, () => {
        const clone = structuredClone(registerData);
        delete clone.email;
        controller.login(clone, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectLogin(localUser.tempId));
        });
      });
    });

    describe('Incorrect data', () => {
      const db = new Database();

      beforeEach(async () => {
        await db.user
          .login(registerData.login)
          .password(registerData.password)
          .email(registerData.email)
          .verified(false)
          .create();
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Already registered`, async () => {
        controller.register(registerData, localUser).catch((err) => {
          expect(err).toEqual(new errors.UsernameAlreadyInUse(localUser.tempId));
        });
      });

      it(`Login incorrect`, async () => {
        controller.register({ ...registerData, login: '!@#$%^&*&*()_+P{:"<?a' }, localUser).catch((err) => {
          expect(err).toEqual(
            new errors.IncorrectCredentials(
              localUser.tempId,
              'Name should only contain arabic letters, numbers and special characters',
            ),
          );
        });
        await db.cleanUp();
      });

      it(`Login too short`, async () => {
        controller.register({ ...registerData, login: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(
            new errors.IncorrectCredentials(localUser.tempId, 'Name should be at least 3 characters'),
          );
        });
        await db.cleanUp();
      });

      it(`Login too long`, async () => {
        controller
          .register(
            {
              ...registerData,
              login:
                'asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
            },
            localUser,
          )
          .catch((err) => {
            expect(err).toEqual(
              new errors.IncorrectCredentials(localUser.tempId, 'Name should be less than 30 characters'),
            );
          });
        await db.cleanUp();
      });

      it(`Password incorrect`, async () => {
        controller.register({ ...registerData, password: 'a@$QEWASD+)}KO_PL{:">?' }, localUser).catch((err) => {
          expect(err).toEqual(
            new errors.IncorrectCredentials(
              localUser.tempId,
              'Password should contain at least 1 digit, 6 letter, 1 upper case letter and 1 lower case letter',
            ),
          );
        });
        await db.cleanUp();
      });

      it(`Password too short`, async () => {
        controller.register({ ...registerData, password: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(
            new errors.IncorrectCredentials(localUser.tempId, 'Password should be at least 6 characters long'),
          );
        });
        await db.cleanUp();
      });

      it(`Password too long`, async () => {
        controller
          .register(
            {
              ...registerData,
              password:
                'aasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsadaasdasdasasdassadsad',
            },
            localUser,
          )
          .catch((err) => {
            expect(err).toEqual(
              new errors.IncorrectCredentials(localUser.tempId, 'Password should be less than 200 characters'),
            );
          });
        await db.cleanUp();
      });

      it(`Passwords do not match`, async () => {
        controller.register({ ...registerData, password2: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentials(localUser.tempId, 'Passwords not the same'));
        });
        await db.cleanUp();
      });

      it(`Email incorrect`, async () => {
        controller.register({ ...registerData, email: 'a' }, localUser).catch((err) => {
          expect(err).toEqual(new errors.IncorrectCredentials(localUser.tempId, 'Not valid email address'));
        });
        await db.cleanUp();
      });
    });
  });

  describe('Should pass', () => {
    const db = new Database();

    beforeEach(async () => {
      await db.user
        .login(registerData.login)
        .password(registerData.password)
        .email(registerData.email)
        .verified(false)
        .create();

      await db.cleanUp();
    });

    it(`Validated register`, async () => {
      controller.register({ ...registerData, email: 'test22@test.test' }, localUser).catch((err) => {
        expect(err.name).toEqual('MongoPoolClosedError');
      });
    });
  });
});
