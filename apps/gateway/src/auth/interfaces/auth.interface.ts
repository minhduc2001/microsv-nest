export interface IJWTPayload {
  sub: number;
  uav?: number;
  email?: number;
}

export interface IJwtPayloadWithRt extends IJWTPayload {
  refreshToken: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IDataThirdParty {
  id?: string;
  email?: string;
  username: string;
  picture?: string;
  locale?: string;
  provider: string;
}
