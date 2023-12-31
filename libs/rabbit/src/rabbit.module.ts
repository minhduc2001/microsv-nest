import { DynamicModule, Module } from '@nestjs/common';
import { RabbitServiceName } from './enums/rabbit.enum';
import {
  ClientsModule,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { RABBIT_SERVICE_OPTIONS, RABBIT_SERVICES } from './constants/constant';
import { EnvModule, EnvService, envService } from '@libs/env';
import { RabbitService } from './rabbit.service';

@Module({
  providers: [RabbitService],
  exports: [RabbitService],
})
export class RabbitModule {
  static forServerProxy(service: RabbitServiceName): DynamicModule {
    return {
      module: RabbitModule,
      imports: [EnvModule],
      providers: [
        {
          provide: RABBIT_SERVICE_OPTIONS,
          useFactory: (envService: EnvService): MicroserviceOptions => {
            return {
              transport: Transport.RMQ,
              options: {
                urls: [envService.RABBIT_MQ_URI],
                queue: RABBIT_SERVICES[service].queue,
              },
            };
          },
          inject: [EnvService],
        },
      ],
      exports: [RABBIT_SERVICE_OPTIONS],
    };
  }

  static forClientProxy(service: RabbitServiceName): DynamicModule {
    return {
      module: RabbitModule,
      imports: [
        ClientsModule.registerAsync({
          clients: [
            {
              name: service,
              imports: [EnvModule],
              useFactory: (envService: EnvService) => ({
                transport: Transport.RMQ,
                options: {
                  urls: [envService.RABBIT_MQ_URI],
                  queue: RABBIT_SERVICES[service].queue,
                },
              }),
              inject: [EnvService],
            },
          ],
        }),
      ],
      exports: [ClientsModule],
    };
  }
}
