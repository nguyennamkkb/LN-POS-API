import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseHelper } from '../common/response.helper';
import { ApiResponse } from '../common/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ApiResponse<null> = ResponseHelper.error(
      status,
      exception.message || 'Internal Server Error',
    );

    response.status(status).json(errorResponse);
  }
}
