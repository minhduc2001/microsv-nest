import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import * as path from 'path';

import * as serviceAccount from 'firebase-key.json';
import { generateUUID } from '@libs/common/utils/function';
import { removeFile } from '@libs/common/utils/file-reslove';
import { envService } from '@libs/env';
@Injectable()
export class UploadService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      storageBucket: envService.STOGARE_BUCKET,
    });
  }

  async uploadFile(fileName: string, folder: string = '') {
    const bucket = admin.storage().bucket();
    const link = path.join(process.cwd(), 'uploads', fileName);

    const fileDestination = folder ? `${folder}/${fileName}` : fileName;
    const metadata = {
      metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: generateUUID(),
      },
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000',
    };

    // Uploads a local file to the bucket
    const [file] = await bucket.upload(link, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      destination: fileDestination,
      gzip: true,
      metadata: metadata,
    });

    removeFile(link); // xóa ảnh trong local

    // Lấy public URL của file
    const publicUrl = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Đặt thời gian hết hạn theo mong muốn
    });

    return publicUrl[0];
  }
}
