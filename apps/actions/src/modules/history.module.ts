import { HistoryService } from './../services/history.service';
import { History } from '@libs/common/entities/actions/history.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryController } from '../controllers/history.controller';
import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
    RabbitModule.forClientProxy(RabbitServiceName.MEDIA),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
