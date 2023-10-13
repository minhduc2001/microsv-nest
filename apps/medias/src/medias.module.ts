import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { ComicsModule } from './comics/comics.module';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { DatabaseModule } from '@libs/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '@libs/common/entities/medias/genre.entity';
import { MediaModule } from './media/media.module';
import { Author } from '@libs/common/entities/medias/author.entity';
import { GenreModule } from './genre/genre.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    LoggerModule,
    RabbitModule.forServerProxy(RabbitServiceName.MEDIA),
    DatabaseModule,
    TypeOrmModule.forFeature([Genre, Author]),
    ComicsModule,
    MediaModule,
    GenreModule,
    AuthorModule,
  ],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule {}
