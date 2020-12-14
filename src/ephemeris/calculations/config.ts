import { Planets } from '../../domain/planetsAndNumbers';

export const planetOrbs: Record<Planets, number> = {
  [Planets.SUN]: 365.2 / 365.2,
  [Planets.MOON]: 365.2 / 27.3,
  [Planets.MERCURY]: 365.2 / 88,
  [Planets.VENUS]: 365.2 / 224.7,
  [Planets.MARS]: 0.6,
  [Planets.JUPITER]: 0.1,
  [Planets.SATURN]: 0.06,
  // [Planets.URANUS]: 365.2 / 30589,
  // [Planets.NEPTUNE]: 365.2 / 59800,
  // [Planets.PLUTO]: 365.2 / 90560,
  [Planets.RAHU]: 0.15,
  [Planets.KETU]: 0.15,
};

export const leewayFactor = 1.1;
