import { Injectable } from '@nestjs/common';
import { planetCodeToPlanetName, Planets } from '../domain/planetsAndNumbers';
import { CalculateEphemeris } from './calculations';
import moment from 'moment';
import { uniq } from 'lodash';
import { PriceService } from '../price/price.service';

export interface PriceRange {
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
}

@Injectable()
export class EphemerisService {
  private timeCalculator = new CalculateEphemeris();

  constructor(private readonly priceService: PriceService) {}

  getTodaysEphemeris() {
    return this.timeCalculator.getJulianDate(moment());
  }

  async projectTimeBasedOnPriceRange(
    priceRange: PriceRange,
    planetsToStudy?: Planets[],
    movePlanetsFromStartOfTheRange = false,
    ratios?: number[],
  ) {
    const pricePercentDiff = this.priceService.calculatePercentDiff(
      priceRange.startPrice,
      priceRange.endPrice,
    );

    const { referenceDate, referencePrice } = this.getReferencePoint(
      movePlanetsFromStartOfTheRange,
      priceRange,
    );

    const rulingPlanetsOfTheRange: Planets[] = planetsToStudy
      ? uniq(planetsToStudy)
      : this.priceService.getRulingPlanetOfNumber(referencePrice);

    const harmonics = this.priceService.getPriceHarmonics(
      pricePercentDiff,
      ratios,
    );

    const projectedTimes = await this.timeCalculator.movePlanetByDegree(
      rulingPlanetsOfTheRange,
      harmonics,
      referenceDate,
    );

    return {
      pricePercentDiff,
      rulingPlanets: rulingPlanetsOfTheRange.map(planetCodeToPlanetName),
      projectedTimes,
    };
  }

  movePlanetsBetweenDates(startDate: Date, endDate: Date, planets: number[]) {
    return this.timeCalculator.movePlanetBetweenDates(planets, {
      startDate,
      endDate,
    });
  }

  private getReferencePoint(
    movePlanetsFromStartOfTheRange: boolean,
    priceRange: PriceRange,
  ) {
    return {
      referenceDate: movePlanetsFromStartOfTheRange
        ? new Date(priceRange.startDate)
        : new Date(priceRange.endDate),

      referencePrice: movePlanetsFromStartOfTheRange
        ? priceRange.startPrice
        : priceRange.endPrice,
    };
  }

  public getDailyPlanetaryLongitudes(
    startDate: Date,
    endDate: Date,
    planets: number[],
  ) {
    return this.timeCalculator.getDailyPlanetaryLongitudes(
      startDate,
      endDate,
      planets,
    );
  }
}
