import swisseph from 'swisseph';

export enum Planets {
  'SUN' = swisseph.SE_SUN,
  'MOON' = swisseph.SE_MOON,
  'MERCURY' = swisseph.SE_MERCURY,
  'VENUS' = swisseph.SE_VENUS,
  'MARS' = swisseph.SE_MARS,
  'JUPITER' = swisseph.SE_JUPITER,
  'SATURN' = swisseph.SE_SATURN,
  // 'URANUS' = swisseph.SE_URANUS,
  // 'NEPTUNE' = swisseph.SE_NEPTUNE,
  // 'PLUTO' = swisseph.SE_PLUTO,
  'RAHU' = swisseph.SE_TRUE_NODE,
  'KETU' = swisseph.SE_TRUE_NODE,
}

export const PlanetNames: Record<Planets, string> = {
  [Planets.SUN]: 'sun',
  [Planets.MOON]: 'moon',
  [Planets.MERCURY]: 'mercury',
  [Planets.VENUS]: 'venus',
  [Planets.MARS]: 'mars',
  [Planets.JUPITER]: 'jupiter',
  [Planets.SATURN]: 'saturn',
  // [Planets.URANUS]: "uranus",
  // [Planets.NEPTUNE]: "neptune",
  // [Planets.PLUTO]: "pluto",
  [Planets.RAHU]: 'rahu',
  [Planets.KETU]: 'ketu',
};

export function planetCodeToPlanetName(p: Planets) {
  return PlanetNames[p];
}

export const NumberRulers = {
  '1': Planets.SUN,
  '2': Planets.MOON,
  '3': Planets.JUPITER,
  '4': Planets.RAHU,
  '5': Planets.MERCURY,
  '6': Planets.VENUS,
  '7': Planets.KETU,
  '8': Planets.SATURN,
  '9': Planets.MARS,
};

export const planetDecimalPointCorrectionMultiplier: Record<
  Planets,
  1 | 10 | 100
> = {
  [Planets.SUN]: 1,
  [Planets.MOON]: 100,
  [Planets.MERCURY]: 10,
  [Planets.VENUS]: 1,
  [Planets.MARS]: 1,
  [Planets.JUPITER]: 1,
  [Planets.SATURN]: 1,
  // [Planets.URANUS]: "uranus",
  // [Planets.NEPTUNE]: "neptune",
  // [Planets.PLUTO]: "pluto",
  [Planets.RAHU]: 1,
  [Planets.KETU]: 1,
};
