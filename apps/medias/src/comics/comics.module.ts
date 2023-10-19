import { Module } from '@nestjs/common';
import { ComicsController } from './comics.controller';
import { ComicsService } from './comics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comics } from '@libs/common/entities/medias/comics.entity';
import { Chapter } from '@libs/common/entities/medias/chapter.entity';
import { GenreModule } from '../genre/genre.module';
import { ChapterModule } from '../chapter/chapter.module';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comics, Chapter]),
    GenreModule,
    AuthorModule,
  ],
  controllers: [ComicsController],
  providers: [ComicsService],
  exports: [ComicsService],
})
export class ComicsModule {}
