import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const message =
      this.reflector.get<string>('message', context.getHandler()) ??
      this.reflector.get<string>('message', context.getClass()) ??
      'Request successful';

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data,
        };
      }),
    );
  }
}
