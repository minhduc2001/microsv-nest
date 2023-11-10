import { Module } from '@nestjs/common';
import { LibraryController } from '../controllers/library.controller';
import { LibraryService } from '../services/library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from '@libs/common/entities/actions/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
