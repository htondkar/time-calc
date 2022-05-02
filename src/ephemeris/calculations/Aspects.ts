import { linearInterpolation } from 'simple-linear-interpolation';
import { limitDecimalPlacesTo } from 'src/shared/numberUtils';

export class AspectsStrength {
  static StandardAspects = [
    { degreeDiff: 0, orb: 4, strength: 60 },
    { degreeDiff: 30, orb: 4, strength: 0 },
    { degreeDiff: 60, orb: 4, strength: 40 },
    { degreeDiff: 90, orb: 4, strength: 15 },
    { degreeDiff: 120, orb: 4, strength: 45 },
    { degreeDiff: 150, orb: 4, strength: 0 },
    { degreeDiff: 180, orb: 4, strength: 60 },
    { degreeDiff: 210, orb: 4, strength: 0 },
    { degreeDiff: 240, orb: 4, strength: 45 },
    { degreeDiff: 270, orb: 4, strength: 15 },
    { degreeDiff: 300, orb: 4, strength: 10 },
    { degreeDiff: 330, orb: 4, strength: 0 },
    { degreeDiff: 360, orb: 4, strength: 60 },
  ];

  private calculate: ReturnType<typeof linearInterpolation>;

  constructor() {
    const points = AspectsStrength.StandardAspects.map(
      ({ degreeDiff, strength }) => ({
        x: degreeDiff,
        y: strength,
      }),
    );

    this.calculate = linearInterpolation(points);
  }

  getAspectStrength(diff: number): number {
    this.validateAspect(diff);
    return limitDecimalPlacesTo(2, this.calculate({ x: diff }));
  }

  getAspectStrengthPercentage(diff: number): string {
    this.validateAspect(diff);
    return (
      limitDecimalPlacesTo(
        1,
        (this.calculate({ x: diff }) / 60) * 100,
      ).toString() + '%'
    );
  }

  private validateAspect(diff: number) {
    if (diff < 0 || diff > 360) {
      throw new Error(`Invalid aspect! ${diff}`);
    }
  }
}
