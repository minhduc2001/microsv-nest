import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { ComicsController } from '../controllers/comics.controller';
import { GenreController } from '../controllers/genre.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.MEDIA)],
  controllers: [ComicsController, GenreController],
  providers: [],
})
export class MediasModule {}
