import { CalculationResult } from 'swisseph';
import moment from 'moment';
import {
  planetDecimalPointCorrectionMultiplier,
  PlanetNames,
  PlanetsCode,
} from '../../domain/planetsAndNumbers';
import { groupBy } from 'lodash';
import { MomentUtils } from 'src/ephemeris/calculations/moment.utils';
import { BaseAstroCalc } from 'src/ephemeris/calculations/BaseAstroCalc';

export interface MovementResult {
  date: string;
  moved: number;
  target: number;
}

export class CalculateEphemeris extends BaseAstroCalc {
  public async movePlanetByDegree(
    planets: PlanetsCode[],
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
        'Helio',
      );

      while (!this.isSameDegree(biggestHarmonic, movement, planet)) {
        baseDate.add(1, 'day');

        const newPosition = await this.getPlanetPosition(
          planet,
          baseDate,
          'Helio',
        );

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
    const days = MomentUtils.diff(startMoment, endMoment, 'days');
    const coordinates = 'Helio';

    const results: Record<
      string,
      Record<PlanetsCode, number> & {
        average: { moved: number; longitude: number };
      }
    > = {};

    let lastAveragePoint = calculateAverage(
      Object.values(
        await this.getPlanetPositions(planets, startMoment, coordinates),
      ),
    );

    let movement = 0;

    for (let index = 0; index < days; index++) {
      const planetsLongitudes = await this.getPlanetPositions(
        planets,
        startMoment,
        coordinates,
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
}

function calculateAverage(nums: number[]) {
  return nums.reduce((acc, current) => acc + current, 0) / nums.length;
}
