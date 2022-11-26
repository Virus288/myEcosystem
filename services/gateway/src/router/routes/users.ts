import { Router } from 'express';
import type * as types from '../../types';
import State from '../../tools/state';
import { FullError } from '../../errors';
import * as enums from '../../enums';
import { EServices } from '../../enums';
import Validator from '../../validation';

const router = Router();

router.post('/login', (req, res: types.ILocalUser) => {
  try {
    const data = req.body as types.ILoginReq;
    Validator.validateLogin(data);
    State.Broker.sendLocally(enums.EUserTargets.Login, res, data, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

router.post('/register', (req, res: types.ILocalUser) => {
  try {
    const data = req.body as types.IRegisterReq;
    Validator.validateRegister(data);
    State.Broker.sendLocally(enums.EUserTargets.Register, res, data, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

export default router;
