export interface IUser {
  id?: number;
  username?: string;
  password?: string;
  name?: string;
}

export interface IJwtPayload {
  sub: number;
  username: string;
  name: string;
}
