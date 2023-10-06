export interface IServiceResponse<T = object> {
  data: T | T[] | null;
}
