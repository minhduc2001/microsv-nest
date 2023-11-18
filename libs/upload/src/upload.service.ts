import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';
import * as path from 'path';

import * as serviceAccount from 'firebase-key.json';
import { generateUUID } from '@libs/common/utils/function';
import { removeFile } from '@libs/common/utils/file-reslove';
import { envService } from '@libs/env';
import chokidar from 'chokidar';

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
      expires: '01-01-2100',
    });

    return publicUrl[0];
  }

  async uploadMultipeFile(fileNames: string[]) {
    const promises = fileNames.map(async (filename) => {
      return await this.uploadFile(filename);
    });

    return await Promise.all(promises);
  }

  // startWatching(uploadDirectory: string) {
  //   const watcher = chokidar.watch(uploadDirectory, {
  //     ignored: /(^|[\/\\])\../,
  //     persistent: true,
  //   });

  //   watcher.on('add', (filePath) => {
  //     if (this.isAllowedFile(filePath)) {
  //       const destinationPath = this.getDestinationPath(filePath);
  //       const bucket = admin.storage().bucket();
  //       const file = bucket.file(destinationPath);

  //       file
  //         .save(destinationPath, {
  //           gzip: true,
  //           metadata: {
  //             contentType: this.getContentType(filePath),
  //           },
  //         })
  //         .then(() => {
  //           console.log('File đã được đẩy lên Firebase Storage.');
  //         })
  //         .catch((error) => {
  //           console.error('Lỗi khi đẩy file lên Firebase Storage:', error);
  //         });
  //     }
  //   });
  // }

  // private isAllowedFile(filePath: string): boolean {
  //   return filePath.match(/\.(ts|m3u8)$/i) !== null;
  // }

  // private getDestinationPath(filePath: string): string {
  //   return filePath.replace(this.uploadDirectory, this.destinationDirectory);
  // }

  // private getContentType(filePath: string): string {
  //   return path.extname(filePath) === '.ts'
  //     ? 'video/mp2t'
  //     : 'application/x-mpegURL';
  // }
}
