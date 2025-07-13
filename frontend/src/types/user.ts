export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  login: string;
  roles: UserRole[];
}

export interface UserAuthLog {
  ip_address: string;
  user_agent: string;
  country: string;
  createdDate: string;
}

export interface UserLoginState {
  login: string;
  password: string;
}

export interface UserCreateState extends UserLoginState {}

export interface UserUpdateState {
  password: string;
}
