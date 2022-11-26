export const EJwtTime = {
  TokenMaxAge: 24 * 60 * 60,
  RefreshTokenMaxAge: 7 * 24 * 60 * 60,
  RemoveMaxAge: 1,
};

export enum EJwt {
  MainToken = 'mainToken',
  RefreshToken = 'refreshToken',
}
