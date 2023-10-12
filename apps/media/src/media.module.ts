import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ComicsModule } from './comics/comics.module';
import { MoviesModule } from './movies/movies.module';
import { MusicModule } from './music/music.module';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    LoggerModule,
    RabbitModule.forServerProxy(RabbitServiceName.MEDIA),
    DatabaseModule,
    ComicsModule,
    MoviesModule,
    MusicModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
