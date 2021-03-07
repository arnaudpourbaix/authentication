import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AuthModuleOptions } from '../../config/module.options';
import { GoogleConflictException } from './google.exception';

@Catch(GoogleConflictException)
export class GoogleExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(AuthModuleOptions)
    private readonly config: AuthModuleOptions
  ) {}

  catch(exception: GoogleConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.redirect(
      `${this.config.google.failureLoginUrl}?status=${exception.getStatus()}`
    );
  }
}
