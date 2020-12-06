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
