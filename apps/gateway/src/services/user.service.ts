import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { IJWTPayload } from '../auth/interfaces/auth.interface';
import { envService } from '@libs/env';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}

  async getTokens(payload: IJWTPayload, options?: JwtSignOptions) {
    const accessToken = this.jwtService.sign(payload, options);
    const refreshToken = this.jwtService.sign(payload, {
      secret: envService.JWT_RT_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string, email: string) {
    const decode = this.jwtService.decode(token);

    console.log(decode);

    if (decode['email'] !== email) {
      return false;
    }
    return this.jwtService.verify(token, {
      secret: envService.JWT_SECRET,
    });
  }
}
