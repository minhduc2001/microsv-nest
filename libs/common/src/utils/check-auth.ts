import { Profile } from '../entities/user/profile.entity';
import { ETypeAccount } from '../enums/common.enum';
import { ERole } from '../enums/role.enum';
import { AuthType } from '../interfaces/common.interface';

function isProfile(auth: AuthType): auth is Profile {
  return (auth as Profile).role === ERole.CHILDRENS;
}

export function detectRole(auth: AuthType) {
  if (isProfile(auth)) {
    return ETypeAccount.Profile;
  }
  return ETypeAccount.User;
}
