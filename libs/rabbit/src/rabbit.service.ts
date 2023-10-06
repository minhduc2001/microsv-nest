import { EnvService, envService } from '@libs/env';
import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitService {
  constructor(private envService: EnvService) {}

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.envService.RABBIT_MQ_URI],
        queue: queue,
        noAck,
        persistent: true,
      },
    };
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    channel.ack(originalMessage);
  }
}
