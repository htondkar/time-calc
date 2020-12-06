import swisseph, { CalculationResult } from 'swisseph';
import moment, { Moment } from 'moment';
import { PlanetNames, Planets } from 'src/ephemeris/planetsAndNumbers';
import { groupBy, sortBy } from 'lodash';

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
    const biggestHarmonic = Math.max(...harmonics);

    for (let index = 0; index < planets.length; index++) {
      const planet = planets[index];

      let movement = 0;
      const baseDate = moment(startDate);
      let currentPositionOfPlanet = await this.getPlanetPosition(
        planet,
        baseDate,
      );

      while (!this.isSameDegree(biggestHarmonic, movement, planet)) {
        baseDate.add(1, 'day');

        // console.group('Moved');
        // console.log(baseDate.toString());

        const newPosition = await this.getPlanetPosition(planet, baseDate);

        const diff = Math.abs(
          newPosition.longitude - currentPositionOfPlanet.longitude,
        );

        if (diff >= 330) {
          // detect when planet goes to 0 degrees from 359
          movement += Math.abs(diff - 360);
        } else {
          movement += diff;
        }

        harmonics.forEach((harmonic) => {
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

  orbs: Record<Planets, number> = {
    [Planets.SUN]: 365.2 / 365.2,
    [Planets.MOON]: 365.2 / 27.3,
    [Planets.MERCURY]: 365.2 / 88,
    [Planets.VENUS]: 365.2 / 224.7,
    [Planets.MARS]: 365.2 / 687,
    [Planets.JUPITER]: 365.2 / 4331,
    [Planets.SATURN]: 365.2 / 10747,
    // [Planets.URANUS]: 365.2 / 30589,
    // [Planets.NEPTUNE]: 365.2 / 59800,
    // [Planets.PLUTO]: 365.2 / 90560,
    [Planets.RAHU]: 365.2 / 6789,
    [Planets.KETU]: 365.2 / 6789,
  };

  leewayFactor = 1.1;

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
    const threshold = this.orbs[planet] * this.leewayFactor;

    // console.log(`Movement: ${movement} | target: ${exactDegree}`);
    // console.groupEnd();

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

  async getPlanetPosition(planetCode: number, date: Moment) {
    const julianDate = await this.getJulianDate(date);
    const FLAG = swisseph.SEFLG_SPEED | swisseph.SEFLG_SWIEPH;
    return new Promise<CalculationResult>((resolve) => {
      swisseph.swe_calc_ut(julianDate, planetCode, FLAG, resolve);
    });
  }
}
