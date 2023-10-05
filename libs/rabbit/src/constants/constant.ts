import { RabbitServiceName } from '../enums/rabbit.enum';

export const RABBIT_SERVICE_OPTIONS = 'RABBIT_SERVICE_OPTIONS';

export const RABBIT_SERVICES: Record<RabbitServiceName, { queue: string }> = {
  USER_SERVICE: {
    queue: 'user_queue',
  },
  AUTH_SERVICE: {
    queue: 'auth_queue',
  },
};
