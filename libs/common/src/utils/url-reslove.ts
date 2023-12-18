import { envService } from '@libs/env';
import { ETypeMedia } from '../enums/media.enum';

export const uploadUrl = (filename: string): string => {
  if (filename.includes('http')) return filename;
  return `http://${envService.IP}:${envService.PORT}/api/v1/uploads/${filename}`;
};

export const convertUrl = (filename: string, type: ETypeMedia): string => {
  if (filename.includes('http')) return filename;
  if (type === ETypeMedia.Music)
    return `http://${envService.IP}:8080/api/music/${filename}/master.m3u8`;
  if (type === ETypeMedia.Movies)
    return `http://${envService.IP}:8080/api/movie/${filename}/master.m3u8`;
};
