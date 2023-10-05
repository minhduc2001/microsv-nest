export const defaultPayload = {
  success: true,
  errorCode: '000000',
  statusCode: 200,
  message: '',
  data: null,
  meta: {},
};

export abstract class Payload<T> {
  success?: boolean;
  errorCode?: string;
  statusCode?: number;
  message?: string;
  data?: T | null;

  constructor(partial: Payload<T>) {
    Object.assign(this, partial);
  }
}
