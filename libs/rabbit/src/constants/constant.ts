import { RabbitServiceName } from '../enums/rabbit.enum';

export const RABBIT_SERVICE_OPTIONS = 'RABBIT_SERVICE_OPTIONS';

export const RABBIT_SERVICES: Record<RabbitServiceName, { queue: string }> = {
  USER_SERVICE: {
    queue: 'user_queue',
  },
  MUSIC_SERVICE: {
    queue: 'music_queue',
  },
  PAYMENT_SYSTEM_SERVICE: {
    queue: 'payment-system_queue',
  },
  MEDIA_SERVICE: {
    queue: 'media_queue',
  },
  FILE_SERVICE: {
    queue: 'file_queue',
  },
  ACTIONS_SERVICE: {
    queue: 'actions_queue',
  },
};
