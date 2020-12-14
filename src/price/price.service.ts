import { Injectable } from '@nestjs/common';
import { NumberRulers, Planets } from '../domain/planetsAndNumbers';
import { sortedUniq, sortBy } from 'lodash';

@Injectable()
export class PriceService {
  calculatePercentDiff(numberA: number, numberB: number) {
    const min = Math.min(numberA, numberB);
    const max = Math.max(numberA, numberB);

    const ratio = Math.abs(max - min) / min;
    return ratio * 100;
  }

  calculateMaxPercentDiff(numberA: number, numberB: number) {
    const min = Math.min(numberA, numberB);
    const max = Math.max(numberA, numberB);

    const ratio1 = Math.abs(max - min) / min;
    const ratio2 = Math.abs(min - max) / max;

    return ratio1 >= ratio2 ? ratio1 * 100 : ratio2 * 100;
  }

  calculateMinPercentDiff(numberA: number, numberB: number) {
    const min = Math.min(numberA, numberB);
    const max = Math.max(numberA, numberB);

    const ratio1 = Math.abs(max - min) / min;
    const ratio2 = Math.abs(min - max) / max;

    return ratio1 <= ratio2 ? ratio1 * 100 : ratio2 * 100;
  }

  getRulingPlanetOfNumber(n: number): Planets[] {
    return n
      .toString()
      .split('')
      .slice(0, 2)
      .map((char) => NumberRulers[char] ?? null)
      .filter((n) => n !== null);
  }

  getPriceHarmonics(
    base: number,
    ratios: number[] = [0.382, 0.618, 1, 1.382, 1.618, 2, 3],
  ): number[] {
    return ratios.map((r) => r * base);
  }

  projectTimeWithSq9MaxDiff(startPrice: number, endPrice: number) {
    const percentDiffMin = this.calculateMinPercentDiff(startPrice, endPrice);
    const percentDiffMax = this.calculateMaxPercentDiff(startPrice, endPrice);

    return {
      minDiff: this.projectTimeWithSquareOfNine(percentDiffMin),
      maxDiff: this.projectTimeWithSquareOfNine(percentDiffMax),
    };
  }

  projectTimeWithSquareOfNine(referencePrice: number, count = 50) {
    referencePrice = Math.round(referencePrice);
    const positiveProgression = this.calculatePositives(referencePrice, count);
    const negativeProgression = this.calculateNegatives(referencePrice);
    const projectedNumbers = [...negativeProgression, ...positiveProgression];

    return sortedUniq(sortBy(projectedNumbers));
  }

  calculateNegatives(start: number) {
    const projectedNumbers = [start];

    // go down to below first ring
    while (projectedNumbers[projectedNumbers.length - 1] > 10) {
      const lastProjectedNumber = projectedNumbers[projectedNumbers.length - 1];

      projectedNumbers.push(
        this.projectMinus360DegreeOnSq9(lastProjectedNumber),
      );
    }

    return sortBy(projectedNumbers.filter((n) => n !== start)); // don't include the start
  }

  calculatePositives(start: number, count: number) {
    const projectedNumbers = [start];

    // take the last item of the array and project from it, then push it to the end of the array
    for (let index = 0; index < count; index++) {
      projectedNumbers.push(
        this.projectPlus360DegreeOnSq9(
          projectedNumbers[projectedNumbers.length - 1],
        ),
      );
    }

    return projectedNumbers;
  }

  projectPlus180DegreeOnSq9(number: number) {
    return Math.round((Math.sqrt(number) + 1) ** 2);
  }

  projectPlus360DegreeOnSq9(number: number) {
    return Math.round((Math.sqrt(number) + 2) ** 2);
  }

  projectMinus180DegreeOnSq9(number: number) {
    return Math.round((Math.sqrt(number) - 1) ** 2);
  }

  projectMinus360DegreeOnSq9(number: number) {
    return Math.round((Math.sqrt(number) - 2) ** 2);
  }
}
