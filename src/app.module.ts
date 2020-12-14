import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EphemerisModule } from './ephemeris/ephemeris.module';
import { PriceModule } from './price/price.module';

@Module({
  imports: [EphemerisModule, PriceModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
