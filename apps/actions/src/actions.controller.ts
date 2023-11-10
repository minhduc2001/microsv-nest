import { Controller, Get } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  getHello(): string {
    return this.actionsService.getHello();
  }
}
