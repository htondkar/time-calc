declare module 'calculate-percentages' {
  namespace main {
    /**
     * calculates what percentage of the second number, the first one is
     * @param numberA
     * @param numberB
     */
    function calculate(fraction: number, base: number): number;

    /**
     * calculates what percentage of the first number
     * @param numberA
     * @param numberB
     */
    function of(base: number, percent: number): number;

    function differenceBetween(numberA: number, numberB: number): number;

    function absoluteDifferenceBetween(
      numberA: number,
      numberB: number,
    ): number;
  }

  export default main;
}
