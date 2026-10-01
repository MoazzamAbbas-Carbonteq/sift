import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

type ErrorResponseBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json(this.fromHttpException(status, exception));
      return;
    }

    const message =
      exception instanceof Error ? exception.message : 'Unhandled exception';
    this.logger.error(message);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }

  private fromHttpException(
    status: number,
    exception: HttpException,
  ): ErrorResponseBody {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return {
        statusCode: status,
        message: exceptionResponse,
        error: httpStatusLabel(status),
      };
    }

    const record = exceptionResponse as {
      message?: unknown;
      error?: unknown;
    };

    return {
      statusCode: status,
      message: isMessage(record.message) ? record.message : exception.message,
      error:
        typeof record.error === 'string'
          ? record.error
          : httpStatusLabel(status),
    };
  }
}

function isMessage(value: unknown): value is string | string[] {
  return (
    typeof value === 'string' ||
    (Array.isArray(value) && value.every((item) => typeof item === 'string'))
  );
}

function httpStatusLabel(status: number): string {
  const label = HttpStatus[status];
  if (typeof label !== 'string') {
    return 'Error';
  }

  return label
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
