import type * as types from './';
import * as enums from '../enums';

export interface IRabbitMessage {
  user: types.ILocalUser;
  target: enums.EUserTargets | enums.EMessageTypes;
  payload: unknown;
}
