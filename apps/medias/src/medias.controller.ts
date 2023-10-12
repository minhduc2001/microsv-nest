import { Controller, Get } from '@nestjs/common';
import { MediasService } from './medias.service';

@Controller()
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Get()
  getHello(): string {
    return this.mediasService.getHello();
  }
}
