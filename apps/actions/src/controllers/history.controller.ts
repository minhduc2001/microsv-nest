import { Controller, Get } from '@nestjs/common';
import { HistoryService } from '../services/history.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ACTIONS_MESSAGE_PATTERN } from '@libs/common/constants/rabbit-patterns.constant';
import { ListHistoryDto, WriteHistoryDto } from '@libs/common/dtos/history.dto';

@Controller()
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.HISTORY.LIST_HISTORY)
  async list(@Payload() query: ListHistoryDto) {
    return this.service.listHistory(query);
  }

  @MessagePattern(ACTIONS_MESSAGE_PATTERN.HISTORY.LOG_HISTORY)
  async log(@Payload() payload: WriteHistoryDto) {
    return this.service.writeHistory(payload);
  }
}
