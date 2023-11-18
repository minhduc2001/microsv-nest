import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '@libs/common/entities/medias/media.entity';
import { ComicsModule } from '../comics/comics.module';
import { Author } from '@libs/common/entities/medias/author.entity';
import { Genre } from '@libs/common/entities/medias/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Author, Genre])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
