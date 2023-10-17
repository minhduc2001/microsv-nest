import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from '@libs/common/entities/medias/chapter.entity';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { ComicsModule } from '../comics/comics.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, Comics]), ComicsModule],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
