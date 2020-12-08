import { Injectable } from '@nestjs/common';
import { CalculationPrice } from 'src/ephemeris/calculations/price';
import { PlanetNames, Planets } from 'src/ephemeris/planetsAndNumbers';
import { CalculateEphemeris } from './calculations';
import moment from 'moment';

export interface PriceRange {
  startDate: string;
  endDate: string;
  startPrice: number;
  endPrice: number;
}

@Injectable()
export class EphemerisService {
  private timeCalculator = new CalculateEphemeris();
  private priceCalculator = new CalculationPrice();

  getTodaysEphemeris() {
    return this.timeCalculator.getJulianDate(moment());
  }

  async projectTimeBasedOnPriceRange(
    priceRange: PriceRange,
    planetsToFollow: Planets[] = this.priceCalculator.getRulingPlanetOfNumber(
      priceRange.endPrice,
    ),
    movePlanetsFromStartOfTheRange = false,
  ) {
    const pricePercentDiff = this.priceCalculator.calculatePercentDiff(
      priceRange.startPrice,
      priceRange.endPrice,
    );

    const rulingPlanetsOfTheRange: Planets[] = planetsToFollow;

    const projectedTimes = await this.projectTime(
      pricePercentDiff,
      rulingPlanetsOfTheRange,
      movePlanetsFromStartOfTheRange
        ? new Date(priceRange.startDate)
        : new Date(priceRange.endDate),
    );

    return {
      pricePercentDiff,
      rulingPlanetsOfTheRange: rulingPlanetsOfTheRange.map(
        (p) => PlanetNames[p],
      ),
      projectedTimes,
    };
  }

  projectTime(baseNumber: number, rulingPlanets: Planets[], startDate: Date) {
    const harmonics = this.priceCalculator.getPriceHarmonics(baseNumber);
    return this.timeCalculator.movePlanetByDegree(
      rulingPlanets,
      harmonics,
      startDate,
    );
  }
}
