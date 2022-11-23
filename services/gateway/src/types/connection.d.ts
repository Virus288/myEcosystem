import { IUsersTokens } from './user';
import * as enums from '../enums';

export interface IRabbitMessage {
  user: IUsersTokens | undefined;
  target: enums.EUserTargets | enums.EMessageType;
  payload: unknown;
}

export type IAvailableServices = Exclude<enums.EServices, enums.EServices.Gateway>;
