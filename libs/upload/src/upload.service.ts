import { Injectable } from '@nestjs/common';
import admin, { ServiceAccount } from 'firebase-admin';

import serviceAccount from 'firebase-key.json';
@Injectable()
export class UploadService {
  // constructor() {
  //   admin.initializeApp({
  //     credential: admin.credential.cert(serviceAccount as ServiceAccount),
  //   });
  // }
  // bucket = admin.storage().bucket();
}
