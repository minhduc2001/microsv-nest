import { Module } from '@nestjs/common';
import { LibraryController } from '../controllers/library.controller';
import { LibraryService } from '../services/library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from '@libs/common/entities/actions/library.entity';
import { LibraryChild } from '@libs/common/entities/actions/library-child.entity';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { LibraryChildService } from '../services/library-child.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Library, LibraryChild]),
    RabbitModule.forClientProxy(RabbitServiceName.MEDIA),
  ],
  controllers: [LibraryController],
  providers: [LibraryService, LibraryChildService],
})
export class LibraryModule {}
