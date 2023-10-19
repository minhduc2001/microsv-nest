import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { ComicsController } from '../controllers/comics.controller';
import { GenreController } from '../controllers/genre.controller';
import { AuthorController } from '../controllers/author.controller';
import { ChapterController } from '../controllers/chapter.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.MEDIA)],
  controllers: [
    ComicsController,
    GenreController,
    AuthorController,
    ChapterController,
  ],
  providers: [],
})
export class MediasModule {}
