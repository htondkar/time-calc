import moment from 'moment';
import { DateRange } from 'src/domain/dateRange';
import {
  PlanetsCode,
  Planets,
  PlanetsNames,
  PlanetNames,
} from 'src/domain/planetsAndNumbers';
import { AspectsStrength } from 'src/ephemeris/calculations/Aspects';
import { BaseAstroCalc } from 'src/ephemeris/calculations/BaseAstroCalc';
import { MomentUtils } from 'src/ephemeris/calculations/moment.utils';

export interface AspectStrengthInput {
  to: PlanetsCode;
  dateRange: DateRange;
}

export class AspectStrengthCalc extends BaseAstroCalc {
  static BadPlanets: PlanetsCode[] = [Planets.JUPITER];
  static goodPlanets: PlanetsCode[] = [
    Planets.SATURN,
    Planets.MARS,
    Planets.VENUS,
  ];

  static slightlyGoodPlanets: PlanetsCode[] = [];
  static slightlyBadPlanets: PlanetsCode[] = [Planets.SUN];

  static neutralPlanets: PlanetsCode[] = [
    Planets.MERCURY,
    Planets.MOON,
    Planets.KETU,
    Planets.RAHU,
  ];

  aspectStrengths = new AspectsStrength();

  public async calculateAspectStrength({ to, dateRange }: AspectStrengthInput) {
    const startMoment = moment(dateRange.start);
    const endMoment = moment(dateRange.end);
    const days = MomentUtils.diff(startMoment, endMoment, 'days');

    const allPlanetsCode = Object.values(Planets) as PlanetsCode[];

    const results = [];

    for (let day = 0; day <= days; day++) {
      const currentDay = startMoment.clone().add(day, 'day');
      const planetaryLongitudeOfTheDay = await this.getPlanetPositions(
        allPlanetsCode,
        currentDay,
        'Geo',
      );

      const aspects = this.calculatePlanetaryAspectDiffs(
        planetaryLongitudeOfTheDay,
        to,
      );

      const aspectStrengths = this.getAspectStrength(aspects);

      results.push({
        date: currentDay.toISOString(),
        aspects: this.formatResults(aspectStrengths),
        net: this.calculateNetAspectStrength(aspectStrengths),
      });
    }

    return results;
  }

  private calculatePlanetaryAspectDiffs(
    longitudes: Record<PlanetsCode, number>,
    to: PlanetsCode,
  ): Record<PlanetsCode, number> {
    const referencePlanetLongitude = longitudes[to];

    const result: Partial<Record<PlanetsCode, number>> = {};

    for (const [planetCode, longitude] of Object.entries(longitudes)) {
      if (planetCode === to.toString()) {
        continue;
      }

      let diffToRefPlanet = Math.floor(referencePlanetLongitude - longitude);
      if (diffToRefPlanet < 0) {
        diffToRefPlanet = 360 + diffToRefPlanet;
      }

      result[planetCode] = diffToRefPlanet;
    }

    return result;
  }

  private getAspectStrength(
    aspects: Record<PlanetsCode, number>,
  ): Record<PlanetsCode, number> {
    const results = {};

    for (const planetCode in aspects) {
      results[planetCode] = this.aspectStrengths.getAspectStrength(
        aspects[planetCode],
      );
    }

    return results;
  }

  private formatResults(
    aspects: Record<PlanetsCode, number>,
  ): Partial<Record<PlanetsNames, number | string>> {
    const results: Partial<Record<PlanetsNames, number | string>> = {};

    for (const planetCode in aspects) {
      results[PlanetNames[planetCode]] = `${aspects[planetCode]} / 60`;
    }

    return results;
  }

  calculateNetAspectStrength(
    aspectsOfDay: Record<PlanetsCode, number>,
  ): number {
    const results: Record<PlanetsCode, number> = {};

    for (const planetCode in aspectsOfDay) {
      const strength = aspectsOfDay[planetCode];
      const auspiciousnessCoefficient = this.getAspectAuspiciousnessCoefficient(
        parseInt(planetCode, 10),
      );

      results[planetCode] = strength * auspiciousnessCoefficient;
    }

    return Math.round(
      Object.values(results).reduce((acc, value) => acc + value, 0),
    );
  }

  getAspectAuspiciousnessCoefficient(planetCode: PlanetsCode): number {
    if (AspectStrengthCalc.goodPlanets.includes(planetCode)) {
      return 1;
    }

    if (AspectStrengthCalc.BadPlanets.includes(planetCode)) {
      return -1;
    }

    if (AspectStrengthCalc.slightlyGoodPlanets.includes(planetCode)) {
      return 0.5;
    }

    if (AspectStrengthCalc.slightlyBadPlanets.includes(planetCode)) {
      return -0.5;
    }

    if (AspectStrengthCalc.neutralPlanets.includes(planetCode)) {
      return 0;
    }
  }
}
