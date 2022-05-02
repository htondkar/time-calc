import { Planets } from 'src/domain/planetsAndNumbers';
import { AspectStrengthCalc } from 'src/ephemeris/calculations/AspectStrengthCalc';

describe('AspectStrengthCalc', () => {
  it('should work!', async () => {
    const calc = await new AspectStrengthCalc().calculateAspectStrength({
      to: Planets.JUPITER,
      dateRange: {
        start: new Date('2020-01-01'),
        end: new Date('2020-01-15'),
      },
    });

    console.log(calc);
  });
});
