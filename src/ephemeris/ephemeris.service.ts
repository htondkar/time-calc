import { Injectable } from '@nestjs/common';
import { CalculateEphemeris } from './calculations';

@Injectable()
export class EphemerisService {
  calculator = new CalculateEphemeris();

  getTodaysEphemeris() {
    return this.calculator.getJulianDate(new Date().toISOString());
  }
}
