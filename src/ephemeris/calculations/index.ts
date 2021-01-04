import swisseph, { CalculationResult } from 'swisseph';
import moment, { Moment } from 'moment';
import {
  planetDecimalPointCorrectionMultiplier,
  PlanetNames,
  Planets,
} from '../../domain/planetsAndNumbers';
import { groupBy } from 'lodash';
import { leewayFactor, planetOrbs } from './config';

export interface MovementResult {
  date: string;
  moved: number;
  target: number;
}

export class CalculateEphemeris {
  public async movePlanetByDegree(
    planets: Planets[],
    harmonics: number[],
    startDate: Date,
  ) {
    const results: Record<string, MovementResult[]> = {};

    for (let index = 0; index < planets.length; index++) {
      let movement = 0;
      const planet = planets[index];
      const baseDate = moment(startDate);
      const multiplier = planetDecimalPointCorrectionMultiplier[planet];

      const harmonicsForThisPlanet = harmonics.map((n) => multiplier * n);
      const biggestHarmonic = Math.max(...harmonicsForThisPlanet);

      let currentPositionOfPlanet = await this.getPlanetPosition(
        planet,
        baseDate,
      );

      while (!this.isSameDegree(biggestHarmonic, movement, planet)) {
        baseDate.add(1, 'day');

        const newPosition = await this.getPlanetPosition(planet, baseDate);

        const diff = this.calculateMovement(
          newPosition,
          currentPositionOfPlanet,
        );

        movement = this.applyDiffToMovement(diff, movement);

        harmonicsForThisPlanet.forEach((harmonic) => {
          if (this.isSameDegree(harmonic, movement, planet)) {
            if (!results[PlanetNames[planet]]) {
              results[PlanetNames[planet]] = [];
            }

            results[PlanetNames[planet]].push({
              date: baseDate.toString(),
              moved: movement,
              target: harmonic,
            });
          }
        });

        currentPositionOfPlanet = newPosition;
      }
    }

    return this.formatResult(results);
  }

  private applyDiffToMovement(diff: number, movement: number) {
    if (diff >= 330) {
      // detect when planet goes to 0 degrees from 359
      movement += Math.abs(diff - 360);
    } else {
      movement += diff;
    }

    return movement;
  }

  private calculateMovement(
    newPosition: CalculationResult,
    currentPositionOfPlanet: CalculationResult,
  ) {
    return Math.abs(newPosition.longitude - currentPositionOfPlanet.longitude);
  }

  private formatResult(results: Record<string, MovementResult[]>) {
    return Object.keys(results).reduce((acc, planet) => {
      const groupedByTarget = groupBy(results[planet], 'target');
      acc[planet] = Object.keys(groupedByTarget).reduce((acc, target) => {
        acc[target] = groupedByTarget[target].sort((a, b) => {
          return Math.abs(a.moved - a.target) > Math.abs(b.moved - b.target)
            ? 1
            : -1;
        })[0];
        return acc;
      }, {});
      return acc;
    }, {});
  }

  public async movePlanetBetweenDates(
    planets: number[],
    dates: { startDate: Date; endDate: Date },
  ) {
    const startMoment = moment(dates.startDate);
    const endMoment = moment(dates.endDate);
    const days = Math.abs(startMoment.diff(endMoment, 'days'));

    const results: Record<
      string,
      Record<Planets, number> & {
        average: { moved: number; longitude: number };
      }
    > = {};

    let lastAveragePoint = calculateAverage(
      Object.values(await this.getPlanetPositions(planets, startMoment)),
    );

    let movement = 0;

    for (let index = 0; index < days; index++) {
      const planetsLongitudes = await this.getPlanetPositions(
        planets,
        startMoment,
      );

      const dateLabel = startMoment.toISOString();

      const averageLongitude = calculateAverage(
        Object.values(planetsLongitudes),
      );

      let averagePointMovement = Math.abs(lastAveragePoint - averageLongitude);

      if (averagePointMovement > 300) {
        averagePointMovement = 360 - averagePointMovement;
      }

      movement += averagePointMovement;

      results[dateLabel] = {
        average: { longitude: averageLongitude, moved: movement },
        ...planetsLongitudes,
      };

      startMoment.add(1, 'day');
      lastAveragePoint = averageLongitude;
    }

    return results;
  }

  isSameDegree(
    exactDegree: number,
    movement: number,
    planet: Planets,
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

  public getJulianDate(moment: Moment) {
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

  private getYearMonthDayHour(moment: Moment) {
    return {
      year: moment.get('year'),
      month: moment.get('month') + 1,
      day: moment.get('D'),
      hour: moment.get('hour'),
    };
  }

  private async getPlanetPosition(planetCode: number, date: Moment) {
    const julianDate = await this.getJulianDate(date);
    const FLAG =
      swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH | swisseph.SEFLG_HELCTR;
    return new Promise<CalculationResult>((resolve) => {
      swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
    });
  }

  async getPlanetPositions(planetCodes: number[], date: Moment) {
    const results: Record<Planets, number> = {};

    for (let index = 0; index < planetCodes.length; index++) {
      const planetCode = planetCodes[index];
      const julianDate = await this.getJulianDate(date);
      const FLAG =
        swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH | swisseph.SEFLG_HELCTR;
      const location = await new Promise<CalculationResult>((resolve) => {
        swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
      });

      results[planetCode] = location.longitude;
    }

    return results;
  }
}

function calculateAverage(nums: number[]) {
  return nums.reduce((acc, current) => acc + current, 0) / nums.length;
}
