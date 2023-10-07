import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { RolesGuard } from '../guards/role.guard';
import { ERole } from '@libs/common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ERole[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    Auth(),
    UseGuards(RolesGuard),
  );
};
