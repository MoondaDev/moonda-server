import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionResponse } from '../util/http';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const CustomException = exception.getResponse() as any;

    response
      .status(status)
      .json(
        new ExceptionResponse(
          status,
          new Date().toISOString(),
          request.url,
          CustomException.message,
        ),
      );
  }
}
