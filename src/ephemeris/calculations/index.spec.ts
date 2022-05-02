import { Planets } from '../../domain/planetsAndNumbers';
import { CalculateEphemeris } from './CalculateEphemeris';
import moment from 'moment';

let calc = new CalculateEphemeris();

beforeEach(() => {
  calc = new CalculateEphemeris();
});

describe('Time calculator', () => {
  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 85, Planets.MOON)).toBe(true);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 95, Planets.SUN)).toBe(false);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 89.5, Planets.MARS)).toBe(true);
  });

  it('should be able to determine close enough degrees', () => {
    expect(calc.isSameDegree(90, 90.2, Planets.SATURN)).toBe(false);
  });
});

describe('getPlanetPositions', () => {
  it('should calculate correctly', async () => {
    const result = await calc.getPlanetPositions([], moment('01-01-2020'));
    expect(result).toEqual({});
  });

  it('should calculate correctly', async () => {
    const result = await calc.getPlanetPositions([1, 2], moment('01-01-2020'));
    expect(result).toEqual({
      1: expect.any(Number),
      2: expect.any(Number),
    });
  });
});
