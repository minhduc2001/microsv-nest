import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envService } from '@libs/env';
import { IJWTPayload } from './auth/interfaces/auth.interface';

@Injectable()
export class GatewayService {
  constructor() {}
}
