import { LoggerService } from '@libs/logger';
import * as fs from 'fs';
import * as path from 'path';
const logger = new LoggerService();

export const removeFile = (link: string) => {
  fs.unlink(link, (error) => {
    if (error) {
      logger.error(error.message);
    }
  });
};
