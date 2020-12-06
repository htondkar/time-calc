import percentage from 'calculate-percentages';
import { NumberRulers, Planets } from 'src/ephemeris/planetsAndNumbers';

export class CalculationPrice {
  calculatePercentDiff(numberA: number, numberB: number) {
    return percentage.absoluteDifferenceBetween(numberA, numberB);
  }

  getRulingPlanetOfNumber(n: number): Planets[] {
    return n
      .toString()
      .split('')
      .slice(0, 2)
      .map((char) => NumberRulers[char] ?? null)
      .filter((n) => n !== null);
  }

  getPriceHarmonics(base: number): number[] {
    const ratios = [0.382, 0.618, 1, 1.382, 1.5, 1.618, 2, 2.618, 3, 4];
    return ratios.map((r) => r * base);
  }
}
