import { RabbitModule } from './../../../libs/rabbit/src/rabbit.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/database';

import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { CommentModule } from './modules/comment.module';
import { LibraryModule } from './modules/library.module';
import { HistoryModule } from './modules/history.module';
import { RabbitServiceName } from '@libs/rabbit/enums/rabbit.enum';
import { LoggerModule } from '@libs/logger';
import { NotiModule } from './modules/noti.module';

@Module({
  imports: [
    RabbitModule.forServerProxy(RabbitServiceName.ACTIONS),
    LoggerModule,
    DatabaseModule,
    CommentModule,
    LibraryModule,
    HistoryModule,
    NotiModule,
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
