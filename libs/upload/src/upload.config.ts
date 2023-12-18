import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as exc from '@libs/common/api';
import { envService } from '@libs/env';
import { makeUUID } from '@libs/common/utils/function';

export const multerConfig = {
  dest: envService.UPLOAD_LOCATION,
};

// Multer upload options
export const multerOptions = {
  limits: {
    fileSize: envService.MAX_FILE_SIZE,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(/\/(jpg|jpeg|png|gif)$/) ||
      file.mimetype.match(/\.xlsx$/i) ||
      file.mimetype.match(/video/) ||
      file.mimetype.match(/audio/)
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new exc.UnsupportedMediaType({
          message: `Unsupported file type ${extname(file.originalname)}`,
        }),
        false,
      );
    }
  },

  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${makeUUID(file.originalname)}`);
    },
  }),
};
