import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EphemerisService } from './ephemeris.service';
import { PriceAndDateRangeBasedCalcsDTO } from '../dto/PriceAndDateRangeBasedCalcs.dto copy';
import { Planets } from 'src/domain/planetsAndNumbers';

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

  @Post('/move-planets-by-price-range')
  @UsePipes(new ValidationPipe({ transform: true }))
  priceRangeBasedCalculation(@Body() body: PriceAndDateRangeBasedCalcsDTO) {
    return this.ephemerisService.projectTimeBasedOnPriceRange(
      body,
      this.resolveStudiedPlanets(body),
      body.movePlanetsFromStartOfTheRange,
      body.ratios,
    );
  }

  private resolveStudiedPlanets(body: PriceAndDateRangeBasedCalcsDTO) {
    return (
      body.planets
        ?.map((p) => p.toUpperCase())
        ?.filter((p) => Object.keys(Planets).includes(p))
        ?.map((p) => Planets[p]) ?? undefined
    );
  }
}
