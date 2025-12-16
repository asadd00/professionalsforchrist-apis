import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    /* ---------------- HTTP Exceptions ---------------- */
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      message =
        typeof res === 'string'
          ? res
          : Array.isArray((res as any).message)
            ? (res as any).message.join(', ')
            : (res as any).message;

      errorCode = (res as any).errorCode || 'HTTP_EXCEPTION';
    }

    /* ---------------- Prisma Errors ---------------- */
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          errorCode = 'RECORD_NOT_FOUND';
          break;

        case 'P2002': // Unique constraint failed
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry';
          errorCode = 'DUPLICATE_ENTRY';
          break;

        default:
          status = HttpStatus.BAD_REQUEST;
          message = exception.message;
          errorCode = 'PRISMA_ERROR';
      }
    }

    /* ---------------- Unknown Errors ---------------- */
    else if (exception instanceof Error) {
      message = exception.message;
      errorCode = 'UNHANDLED_ERROR';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
      stacktrace: process.env.ENV === 'dev' && exception instanceof Error
        ? exception.stack
        : null
    });
  }
}
