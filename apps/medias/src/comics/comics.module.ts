import { Module } from '@nestjs/common';
import { ComicsController } from './comics.controller';
import { ComicsService } from './comics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { Chapter } from '@libs/common/entities/medias/chapter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comics, Chapter])],
  controllers: [ComicsController],
  providers: [ComicsService],
})
export class ComicsModule {}
