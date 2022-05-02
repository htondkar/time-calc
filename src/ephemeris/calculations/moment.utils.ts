import moment, { Moment } from 'moment';

export namespace MomentUtils {
  export function diff(
    startMoment: Moment,
    endMoment: Moment,
    unit: moment.unitOfTime.Diff,
  ): number {
    return Math.abs(startMoment.diff(endMoment, unit));
  }
}
