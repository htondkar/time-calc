import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EphemerisService } from './ephemeris.service';
import { PriceAndDateRangeBasedCalcsDTO } from '../dto/PriceAndDateRangeBasedCalcs.dto';
import { Planets } from '../domain/planetsAndNumbers';
import { DateRangeDTO } from '../dto/dateRange.dto';

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

  @Post('/move-planets-by-date-range')
  @UsePipes(new ValidationPipe({ transform: true }))
  async movePlanetsByDateRange(@Body() body: DateRangeDTO) {
    const result = await this.ephemerisService.movePlanetsBetweenDates(
      body.startDate,
      body.endDate,
      this.resolveStudiedPlanets(body),
    );

    return result;
  }

  private resolveStudiedPlanets(body: { planets?: string[] }): number[] {
    return (
      body.planets
        ?.map((p) => p.toUpperCase())
        ?.filter((p) => Object.keys(Planets).includes(p))
        ?.map((p) => Planets[p]) ?? undefined
    );
  }
}
