import { Profile } from '../entities/user/profile.entity';
import { User } from '../entities/user/user.entity';

export interface ComicsImageurl {
  index: number;
  url: string;
}

export type AuthType = User | Profile;
