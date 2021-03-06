import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EphemerisService } from './ephemeris.service';
import { PriceRangeBasedCalcsDTO } from 'src/ephemeris/types';

@Controller('ephemeris')
export class EphemerisController {
  constructor(private readonly ephemerisService: EphemerisService) {}

  @Get('/')
  async index() {
    return {
      gregorianDate: new Date().toISOString(),
      julianDate: await this.ephemerisService.getTodaysEphemeris(),
    };
  }

  @Post('/price-range')
  @UsePipes(new ValidationPipe({ transform: true }))
  priceRangeBasedCalculation(@Body() body: PriceRangeBasedCalcsDTO) {
    return this.ephemerisService.projectTimeBasedOnPriceRange(body);
  }
}
