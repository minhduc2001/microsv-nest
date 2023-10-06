import { envService } from '@libs/env';

export const uploadUrl = (filename: string): string => {
  if (filename.includes('http')) return filename;
  return `http://${envService.IP}:${envService.PORT}/api/v1/uploads/${filename}`;
};
