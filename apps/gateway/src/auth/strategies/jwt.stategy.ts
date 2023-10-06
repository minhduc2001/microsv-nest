import { lastValueFrom } from 'rxjs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

// APPS

// Libs
import * as exc from '@libs/common/api';
import { envService } from '@libs/env';
import { IJWTPayload } from '../interfaces/auth.interface';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(RabbitServiceName.USER) private userClientProxy: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.JWT_SECRET,
    });
  }

  async validate(payload: IJWTPayload) {
    try {
      const user = await lastValueFrom(this.userClientProxy.send<any>('', {}));
      if (!user) throw new exc.Unauthorized({ message: 'Token is not valid' });

      delete user?.password;
      delete user?.refreshToken;
      return user;
    } catch (e) {
      throw new exc.Unauthorized({ message: 'Token is not valid' });
    }
  }
}
