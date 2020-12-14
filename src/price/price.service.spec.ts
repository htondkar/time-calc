import { PriceService } from 'src/price/price.service';
import 'jest-extended';

describe('Price service', () => {
  it('should work with 45 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(10, 10 * 1.36);
    expect(projected).toContainValues([9, 16, 25, 36, 49, 81, 100, 121, 144]);
  });

  it('should do negative correctly', () => {
    const priceService = new PriceService();
    const projected = priceService.calculateNegatives(36);
    expect(projected).toEqual([9, 16, 25]);
  });

  it('should work with 90 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(10, 10 * 1.34);
    const ref = [8, 15, 23, 34, 46, 61, 77, 96, 116, 139, 163, 190];

    ref.forEach((refNumber, index) => {
      expect(
        priceService.calculatePercentDiff(projected[index], refNumber),
      ).toBeLessThanOrEqual(10);
    });
  });

  it('should work with 135 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(10, 10 * 1.57);
    expect(projected).toContainValues([7, 13, 21, 31, 43, 57, 73, 91, 111]);
  });

  it('should work with 180 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(10, 10 * 1.86);
    const ref = [5, 11, 19, 28, 40, 53, 69, 86, 106, 127, 151, 176];

    ref.forEach((refNumber, index) => {
      expect(
        priceService.calculatePercentDiff(projected[index], refNumber),
      ).toBeLessThanOrEqual(10);
    });
  });

  it('should work with any arbitrary axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(10, 10 * 1.88);
    const ref = [5, 12, 20, 29, 41, 55, 71, 88, 108, 130, 153, 179];

    ref.forEach((refNumber, index) => {
      expect(
        priceService.calculatePercentDiff(projected[index], refNumber),
      ).toBeLessThanOrEqual(12);
    });
  });
});
