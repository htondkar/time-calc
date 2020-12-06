import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EphemerisModule } from './ephemeris/ephemeris.module';

@Module({
  imports: [EphemerisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
