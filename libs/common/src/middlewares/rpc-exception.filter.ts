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
    const _data = host.switchToRpc().getData();
    const data = _data.value;
    const meta = _data.headers;
    const path = _data.topic;

    if ('response' in exception) {
      console.log('vao day');

      // @ts-ignore
      const response = exception.response;

      return throwError(() => ({
        message: response?.message,
        data: response.data ?? null,
        errorCode: response.errorCode ?? '000000',
        // @ts-ignore
        status: exception?.status ?? 200,
      }));
    }

    // const error = new excRpc.BadException();

    return throwError(() => ({
      errorCode: excRpc.UNKNOWN,
      message:
        exception?.message ??
        'Uh oh! Something went wrong in RPC. Please report to develop team.',
      status: 500,
    }));
  }
}
