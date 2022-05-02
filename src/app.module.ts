import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppLoggerMiddleware } from './loggerMiddleware';
import { EphemerisModule } from './ephemeris/ephemeris.module';
import { PriceModule } from './price/price.module';
import { AppController } from 'src/app.controller';

@Module({
  imports: [EphemerisModule, PriceModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
