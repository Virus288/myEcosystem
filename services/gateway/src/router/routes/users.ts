import { Router } from 'express';
import type * as types from '../../types';
import State from '../../tools/state';
import { FullError } from '../../errors';
import * as enums from '../../enums';
import { EServices } from '../../enums';

const router = Router();

router.post('/login', (req, res: types.ILocalUser) => {
  try {
    State.Broker.sendLocally(enums.EUserTargets.Login, res, req.body, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

router.post('/register', (req, res: types.ILocalUser) => {
  try {
    State.Broker.sendLocally(enums.EUserTargets.Register, res, req.body, EServices.Users);
  } catch (err) {
    const { message, code, name, status } = err as FullError;
    res.status(status).json({ message, code, name });
  }
});

export default router;
