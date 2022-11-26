export interface ILoginReq {
  login: string;
  password: string;
}

export interface IRegisterReq extends ILoginReq {
  email: string;
  login: string;
  password: string;
  password2: string;
}
