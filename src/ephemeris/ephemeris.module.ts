import { Module } from '@nestjs/common';
import { EphemerisController } from './ephemeris.controller';
import { EphemerisService } from './ephemeris.service';

@Module({
  controllers: [EphemerisController],
  providers: [EphemerisService],
})
export class EphemerisModule {}
