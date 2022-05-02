export function limitDecimalPlacesTo(decimalPlaces: number, value: number) {
  const d = Math.pow(10, decimalPlaces);
  return Math.round((value + Number.EPSILON) * d) / d;
}
