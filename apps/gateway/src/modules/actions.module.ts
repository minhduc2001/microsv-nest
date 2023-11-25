import { RabbitModule } from '@libs/rabbit';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { Module } from '@nestjs/common';
import { HistoryController } from '../controllers/history.controller';
import { LibraryController } from '../controllers/library.controller';

@Module({
  imports: [RabbitModule.forClientProxy(RabbitServiceName.ACTIONS)],
  controllers: [HistoryController, LibraryController],
})
export class ActionsModule {}
