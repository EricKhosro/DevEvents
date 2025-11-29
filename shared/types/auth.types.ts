export interface IAuthDTO {
  email: string;
  password: string;
  rePassword: string;
}

export interface IMe {
  email: string | null;
  username: string | null;
  avatar: string | null;
}
