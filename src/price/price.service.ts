import { Injectable } from '@nestjs/common';
import { NumberRulers, PlanetsCode } from '../domain/planetsAndNumbers';
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

  getRulingPlanetOfNumber(n: number): PlanetsCode[] {
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
        this.projectMinus180DegreeOnSq9(lastProjectedNumber),
      );
    }

    return sortBy(projectedNumbers.filter((n) => n !== start)); // don't include the start
  }

  calculatePositives(start: number, count: number) {
    const projectedNumbers = [start];

    // take the last item of the array and project from it, then push it to the end of the array
    for (let index = 0; index < count; index++) {
      projectedNumbers.push(
        this.projectPlus180DegreeOnSq9(
          projectedNumbers[projectedNumbers.length - 1],
        ),
      );
    }

    return projectedNumbers;
  }

  projectPlus180DegreeOnSq9(number: number) {
    const { angle, layer } = this.getLayerAndDegreeOnSq9(number);
    const firstTry = this.getPriceByAngle(angle + 180, layer);

    if (firstTry > number) {
      return firstTry;
    }

    return this.getPriceByAngle(angle + 180, layer + 1);
  }

  projectMinus180DegreeOnSq9(number: number) {
    const { angle, layer } = this.getLayerAndDegreeOnSq9(number);
    const firstTry = this.getPriceByAngle(angle + 180, layer);

    if (firstTry < number) {
      return firstTry;
    }

    return this.getPriceByAngle(angle + 180, layer - 1);
  }

  projectPlus360DegreeOnSq9(number: number) {
    const { angle, layer } = this.getLayerAndDegreeOnSq9(number);
    return this.getPriceByAngle(angle, layer + 1);
  }

  projectMinus360DegreeOnSq9(number: number) {
    const { angle, layer } = this.getLayerAndDegreeOnSq9(number);
    return this.getPriceByAngle(angle, layer - 1);
  }

  getLayerAndDegreeOnSq9(number: number) {
    return {
      angle: this.getPriceAngleOnSq9(number),
      layer: this.findLayerOfNumberOnSq9(number),
    };
  }

  /**
   * return the angle based on the Aries start point, counter clockwise
   * so 37 is 135 degrees
   * so 81 is 315 degrees
   */
  getPriceAngleOnSq9(price: number) {
    const r = this.findSmallestOddNumberBiggerThanSquareRootOf(price);
    const ratio = (r ** 2 - price) / (r - 1);
    const θ = 315 - 90 * ratio;

    if (θ < 0) {
      return 360 + θ;
    }

    return θ;
  }

  findSmallestOddNumberBiggerThanSquareRootOf(n: number) {
    const sqrt = Math.floor(Math.sqrt(n));

    if (sqrt % 2 === 0) {
      return sqrt + 1;
    }

    return sqrt + 2;
  }

  findNearestOddNumberSmallerThanSquareRootOf(n: number) {
    const sqrt = Math.floor(Math.sqrt(n));

    if (sqrt % 2 === 0) {
      return sqrt - 1;
    }

    return sqrt;
  }

  findOrderOfOddNumber(oddNumber: number) {
    return (oddNumber + 1) / 2;
  }

  findLayerOfNumberOnSq9(number: number) {
    return this.findOrderOfOddNumber(
      this.findNearestOddNumberSmallerThanSquareRootOf(number),
    );
  }

  /**
   * calculates the price on a nth layer using an angle
   * layers start at 0
   */
  getPriceByAngle(θ: number, layer: number) {
    θ = θ % 360; // it's important to support angles above 360
    const r = 2 * layer + 1;
    const Pn = r ** 2 + ((θ - 315) * (r - 1)) / 90;
    return Pn;
  }
}
