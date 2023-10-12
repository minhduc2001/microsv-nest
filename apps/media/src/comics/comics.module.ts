import { Module } from '@nestjs/common';
import { ComicsController } from './comics.controller';
import { ComicsService } from './comics.service';

@Module({
  imports: [],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
