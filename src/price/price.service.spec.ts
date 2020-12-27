import { PriceService } from 'src/price/price.service';
import 'jest-extended';

describe('Price service', () => {
  it('should work with 45 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(9);
    expect(projected).toContainValues([
      9,
      17,
      25,
      37,
      49,
      65,
      81,
      101,
      121,
      145,
    ]);
  });

  it('should do negative correctly', () => {
    const priceService = new PriceService();
    const projected = priceService.calculateNegatives(37);
    expect(projected).toEqual([9, 17, 25]);
  });

  it('should work with 90 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(15);
    const ref = [15, 23, 34, 46, 61, 77, 96, 116, 139, 163, 190];
    expect(projected).toContainValues(ref);
  });

  it('should work with 135 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(91);
    expect(projected).toContainValues([7, 13, 21, 31, 43, 57, 73, 91, 111]);
  });

  it('should work with 180 axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(53);
    const ref = [11, 19, 28, 40, 53, 69, 86, 106, 127, 151, 176];
    expect(projected).toContainValues(ref);
  });

  it('should work with any arbitrary axis', () => {
    const priceService = new PriceService();
    const projected = priceService.projectTimeWithSquareOfNine(67);
    const ref = [10, 18, 27, 39];
    ref.forEach((refNumber, index) => {
      expect(
        priceService.calculatePercentDiff(refNumber, projected[index]),
      ).toBeLessThan(10);
    });
  });
});

describe('findSmallestOddNumberBiggerThanSquareRootOf', () => {
  test('work!', () => {
    const priceService = new PriceService();
    expect(priceService.findSmallestOddNumberBiggerThanSquareRootOf(90)).toBe(
      11,
    );

    expect(priceService.findSmallestOddNumberBiggerThanSquareRootOf(73)).toBe(
      9,
    );

    expect(priceService.findSmallestOddNumberBiggerThanSquareRootOf(81)).toBe(
      11,
    );
  });
});

describe('getPriceAngleOnSq9', () => {
  test.each([
    [73, 225],
    [77, 270],
    [81, 315],
    [86, 0],
    [91, 45],
    [46, 270],
    [73, 225],
    [81, 315],
    [53, 0],
  ])('for price %i, expect %i', (price, angle) => {
    const priceService = new PriceService();
    expect(priceService.getPriceAngleOnSq9(price)).toBe(angle);
  });
});

describe('getPriceByAngle', () => {
  test.each([
    [0, 3, 28],
    [45, 3, 31],
    [90, 3, 34],
    [135, 3, 37],
    [180, 3, 40],
    [225, 3, 43],
    [270, 3, 46],
    [315, 3, 49],
    [157.5, 3, 38.5],
    [157.5, 6, 148],
  ])('for angle %i, layer %i, expect: %i', (angle, layer, price) => {
    const priceService = new PriceService();
    expect(priceService.getPriceByAngle(angle, layer)).toBe(price);
  });
});

describe('findNearestOddNumberSmallerThanSquareRootOf', () => {
  test.each([
    [8, 1],
    [45, 5],
    [51, 7],
    [62, 7],
    [86, 9],
  ])('for number %i, expect: %i', (number, target) => {
    const priceService = new PriceService();
    expect(
      priceService.findNearestOddNumberSmallerThanSquareRootOf(number),
    ).toBe(target);
  });
});

describe('findLayerOfNumberOnSq9', () => {
  test.each([
    [8, 1],
    [45, 3],
    [51, 4],
    [62, 4],
    [86, 5],
  ])('for number %i, expect: %i', (number, target) => {
    const priceService = new PriceService();
    expect(priceService.findLayerOfNumberOnSq9(number)).toBe(target);
  });
});
