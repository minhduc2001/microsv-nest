export interface IUserGetByUniqueKey {
  phone?: string;
  email?: string;
}

export interface ICreateUser {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  phone?: string;
  isActive?: boolean;
}
