import { Planets } from '../planetsAndNumbers';
import { CalculateEphemeris } from './index';

let calc = new CalculateEphemeris();

beforeEach(() => {
  calc = new CalculateEphemeris();
});

describe('Time calculator', () => {
  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 95, Planets.MOON)).toBe(true);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 95, Planets.SUN)).toBe(false);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 91, Planets.SUN)).toBe(true);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 90.2, Planets.SATURN)).toBe(false);
  });
});
