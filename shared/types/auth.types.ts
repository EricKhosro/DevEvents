export interface ILoginDTO {
  username: string;
  password: string;
}

export interface IRegisterDTO extends ILoginDTO {
  email: string;
  password: string;
  username: string;
  rePassword: string;
}

export interface IUser {
  email: string;
  password: string;
  username: string;
  avatar: string | null;
}

export interface IMe {
  email: string | null;
  username: string | null;
  avatar: string | null;
}
