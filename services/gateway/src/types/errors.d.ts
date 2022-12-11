export interface IFullError extends Error {
  code: string;
  status: number;
  userId: string;
}
