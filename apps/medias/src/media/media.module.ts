import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@libs/common/entities/medias/media.entity';
import { ComicsModule } from '../comics/comics.module';
import { Author } from '@libs/common/entities/medias/author.entity';
import { Genre } from '@libs/common/entities/medias/genre.entity';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, Author, Genre]),
    RabbitModule.forClientProxy(RabbitServiceName.ACTIONS),
    RabbitModule.forClientProxy(RabbitServiceName.USER),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
