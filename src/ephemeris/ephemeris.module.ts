import { Module } from '@nestjs/common';
import { PriceService } from '../price/price.service';
import { EphemerisController } from './ephemeris.controller';
import { EphemerisService } from './ephemeris.service';

@Module({
  controllers: [EphemerisController],
  providers: [PriceService, EphemerisService],
})
export class EphemerisModule {}
