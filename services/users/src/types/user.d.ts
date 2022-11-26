import * as enums from '../enums';
import mongoose from 'mongoose';

export interface IUser extends IUserLean, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IUserLean {
  _id: mongoose.Types.ObjectId;
  login: string;
  email: string;
  verified: string;
  password: string;
  type: enums.EUserTypes;
}

export interface ILocalUser {
  userId: string | undefined;
  tempId: string;
  validated: boolean;
  type: enums.EUserTypes;
}

export interface IUserCredentials {
  mainToken: string;
  refreshToken: string;
  userId: string;
}
