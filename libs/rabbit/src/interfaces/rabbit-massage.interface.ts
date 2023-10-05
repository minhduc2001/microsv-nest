export interface IServiceResponse<T = object> {
  success: boolean;
  data: T | T[];
  message?: string;
  errorCode: string;
}
