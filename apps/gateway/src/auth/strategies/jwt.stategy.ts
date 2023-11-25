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
import { USER_MESSAGE_PATTERNS } from '@libs/common/constants/rabbit-patterns.constant';
import { Profile } from '@libs/common/entities/user/profile.entity';
import { User } from '@libs/common/entities/user/user.entity';

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
      if (payload.parentId) {
        const profile = await lastValueFrom(
          this.userClientProxy.send<any>(
            USER_MESSAGE_PATTERNS.PROFILE.GET_PROFILE,
            payload.sub,
          ),
        );
        if (!profile)
          throw new exc.Unauthorized({ message: 'Token is not valid' });

        delete profile?.password;
        return profile as Profile;
      }

      const user = await lastValueFrom(
        this.userClientProxy.send<any>(USER_MESSAGE_PATTERNS.GET_USER, {
          id: payload.sub,
        }),
      );
      if (!user) throw new exc.Unauthorized({ message: 'Token is not valid' });

      delete user?.password;
      delete user?.refreshToken;
      return user as User;
    } catch (e) {
      throw new exc.Unauthorized({ message: 'Token is not valid' });
    }
  }
}
