import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { ComicsController } from '../controllers/comics.controller';
import { GenreController } from '../controllers/genre.controller';
import { AuthorController } from '../controllers/author.controller';
import { ChapterController } from '../controllers/chapter.controller';
import { MovieController } from '../controllers/movie.controller';
import { MusicController } from '../controllers/music.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.MEDIA)],
  controllers: [
    MovieController,
    ComicsController,
    GenreController,
    AuthorController,
    ChapterController,
    MusicController,
  ],
  providers: [],
})
export class MediasModule {}
