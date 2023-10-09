import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './upload.config';

@Global()
@Module({
  imports: [MulterModule.register(multerOptions)],
  providers: [UploadService],
  exports: [UploadService, MulterModule],
})
export class UploadModule {}
