export interface IUserGetByUniqueKey {
  phone?: string;
  email?: string;
}

export interface ICreateUser {
  email: string;
  password: string;
}
