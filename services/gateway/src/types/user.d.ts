import * as enums from '../enums';
import express from 'express';

export interface IUsersTokens {
  userId: string | undefined;
  tempId: string;
  validated: boolean;
  newToken?: string;
  type: enums.EUserTypes;
}

export interface ILocalUser extends express.Response {
  locals: IUsersTokens;
}

export interface IUserCredentials {
  mainToken: string;
  refreshToken: string;
  userId: string;
}
