import { LoggerService } from '@libs/logger';
import * as fs from 'fs';
import * as path from 'path';
const logger = new LoggerService();

export const removeFile = (filePath: string, root: string) => {
  const link = path.join(root, filePath);
  fs.unlink(link, (error) => {
    if (error) {
      logger.error(error.message);
    }
  });
};
