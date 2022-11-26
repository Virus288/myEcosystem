import jwt from 'jsonwebtoken';
import * as enums from '../enums';
import getConfig from './configLoader';
import bcrypt from 'bcrypt';

export const generateMainToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().token, {
    expiresIn: enums.EJwtTime.TokenMaxAge,
  });
};

export const generateRefreshToken = (id: string, type: enums.EUserTypes): string => {
  return jwt.sign({ id, type }, getConfig().refToken, {
    expiresIn: enums.EJwtTime.RefreshTokenMaxAge,
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};
