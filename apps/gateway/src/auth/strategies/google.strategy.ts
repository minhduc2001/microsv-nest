import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { IDataThirdParty } from '../interfaces/auth.interface';
import { envService } from '@libs/env';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envService.GOOGLE_CLIENT_ID,
      clientSecret: envService.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/v1/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: IDataThirdParty = {
      provider: 'google',
      email: emails[0].value,
      username: name.givenName + name.familyName,
      avatar: photos[0].value,
    };
    return user;
  }
}
