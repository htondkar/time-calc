import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, path: url, body } = request;

    response.on('close', () => {
      const { statusCode } = response;
      this.logger.log(
        `${method} ${url} status ${statusCode} | body ${JSON.stringify(body)}`,
      );
    });

    next();
  }
}
