export interface JwtPayload {
  sub: number;
  email: string;
}

interface IStoreInfo {
  id: number;
  name: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: number;
    full_name: string;
    email: string;
  }

}
