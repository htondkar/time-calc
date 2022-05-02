import swisseph, { CalculationResult } from 'swisseph';
import moment, { Moment } from 'moment';
import {
  planetCodeToPlanetName,
  PlanetsCode,
} from '../../domain/planetsAndNumbers';
import { leewayFactor, planetOrbs } from './config';

type Coordinates = 'Geo' | 'Helio';

export class BaseAstroCalc {
  protected isSameDegree(
    exactDegree: number,
    movement: number,
    planet: PlanetsCode,
  ): boolean {
    if (Math.abs(movement - exactDegree) < 0.001) {
      return true;
    }

    if (movement > exactDegree) {
      return false;
    }

    const diff = Math.abs(exactDegree - movement);
    const threshold = planetOrbs[planet] * leewayFactor;

    return diff <= threshold;
  }

  getJulianDate(moment: Moment) {
    const { year, month, day, hour } = this.getYearMonthDayHour(moment);

    return new Promise((resolve) => {
      swisseph.swe_julday(
        year,
        month,
        day,
        hour,
        swisseph.SE_GREG_CAL,
        resolve,
      );
    });
  }

  protected getYearMonthDayHour(moment: Moment) {
    return {
      year: moment.get('year'),
      month: moment.get('month') + 1,
      day: moment.get('D'),
      hour: moment.get('hour'),
    };
  }

  private getSwissEphFlags(coordinates: Coordinates) {
    if (coordinates === 'Geo') {
      return swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;
    }

    return swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH | swisseph.SEFLG_HELCTR;
  }

  protected async getPlanetPosition(
    planetCode: number,
    date: Moment,
    coordinates: Coordinates,
  ) {
    const julianDate = await this.getJulianDate(date);
    const FLAG = this.getSwissEphFlags(coordinates);
    return new Promise<CalculationResult>((resolve) => {
      swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
    });
  }

  protected async getPlanetPositions(
    planetCodes: number[],
    date: Moment,
    coordinates: Coordinates,
  ) {
    const results: Record<PlanetsCode, number> = {};

    for (let index = 0; index < planetCodes.length; index++) {
      const planetCode = planetCodes[index];
      const julianDate = await this.getJulianDate(date);
      const FLAG = this.getSwissEphFlags(coordinates);
      const location = await new Promise<CalculationResult>((resolve) => {
        swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
      });

      results[planetCode] = location.longitude;
    }

    return results;
  }

  async getDailyPlanetaryLongitudes(
    startDate: Date,
    endDate: Date,
    planets: number[],
    coordinates: Coordinates,
  ) {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const days = Math.abs(startMoment.diff(endMoment, 'days'));

    const results = {};

    planets.forEach((planet) => {
      results[planetCodeToPlanetName(planet)] = [];
    });

    const FLAG = this.getSwissEphFlags(coordinates);

    for (let index = 0; index < days; index++) {
      const currentDate = startMoment.clone().add(index + 1, 'day');
      const julianDate = await this.getJulianDate(currentDate);

      planets.forEach(async (planetCode) => {
        const location = await new Promise<CalculationResult>((resolve) => {
          swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
        });

        const roundedLongitude =
          Math.round((location.longitude + Number.EPSILON) * 100) / 100;

        results[planetCodeToPlanetName(planetCode)].push(roundedLongitude);
      });
    }

    return results;
  }
}
