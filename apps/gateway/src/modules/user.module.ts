import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envService } from '@libs/env';
import { UserService } from '../services/user.service';
import { ProfileController } from '../controllers/profile.controller';
import { JwtStrategy } from '../auth/strategies/jwt.stategy';
import { GoogleStrategy } from '../auth/strategies/google.strategy';
import { MailerModule } from '@libs/mailer';

@Module({
  imports: [
    RabbitModule.forClientProxy(RabbitServiceName.USER),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envService.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    MailerModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [UserService, JwtStrategy, GoogleStrategy],
})
export class UserModule {}
