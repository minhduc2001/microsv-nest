export interface IJWTPayload {
  sub: number;
  uav?: number;
  email?: string;
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
  avatar?: string;
  locale?: string;
  provider: string;
}
