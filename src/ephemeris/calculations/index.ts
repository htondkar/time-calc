import swisseph from 'swisseph';
import moment from 'moment';

export class CalculateEphemeris {
  public getJulianDate(date: Date | string) {
    const { year, month, day, hour } = this.getYearMonthDayHour(date);

    return new Promise((resolve) => {
      swisseph.swe_julday(
        year,
        month,
        day,
        hour,
        swisseph.SE_GREG_CAL,
        resolve,
      );
    });
  }

  private getYearMonthDayHour(date: Date | string) {
    const momentInstance = moment(date);

    return {
      year: momentInstance.get('year'),
      month: momentInstance.get('month') + 1,
      day: momentInstance.get('D'),
      hour: momentInstance.get('hour'),
    };
  }
}
