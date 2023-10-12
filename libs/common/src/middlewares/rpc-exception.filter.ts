import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter as ExceptionFilter,
  HttpException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import * as excRpc from '@libs/common/api';
import { LoggerService } from '@libs/logger';

@Catch()
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException | HttpException>
{
  constructor(private readonly loggerService: LoggerService) {}

  private logger = this.loggerService.getLogger('rpc-exception');

  catch(
    exception: RpcException | HttpException,
    host: ArgumentsHost,
  ): Observable<any> {
    console.log('vl luon dau cat moi');

    const _data = host.switchToRpc().getData();
    const data = _data.value;
    const meta = _data.headers;
    const path = _data.topic;

    let error_data = {} as any;
    let status_code = 500;

    if (exception instanceof HttpException) {
      error_data = exception.getResponse();
      status_code = exception.getStatus();
    }
    this.logger.error(exception);

    if ('response' in exception) {
      // @ts-ignore
      const response = exception.response;

      return throwError(
        () =>
          new excRpc.BadException({
            message: response.message,
            data: response.data ?? null,
          }),
      );
    }

    const error = new excRpc.BadException({
      errorCode: excRpc.UNKNOWN,
      message: exception.message,
    });

    return throwError(() => error);
  }
}
