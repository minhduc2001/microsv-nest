import { Genre } from '@libs/common/entities/medias/genre.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre]),
    RabbitModule.forClientProxy(RabbitServiceName.ACTIONS),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
