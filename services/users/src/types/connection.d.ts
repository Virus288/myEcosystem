import { ILocalUser } from './user';
import * as enums from '../enums';

export interface IRabbitMessage {
  user: ILocalUser;
  target: enums.EUserTargets | enums.EMessageTypes;
  payload: unknown;
}
