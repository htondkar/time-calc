import { IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Planets } from 'src/domain/planetsAndNumbers';

export class LongitudeOverTime {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsArray()
  planets: (keyof typeof Planets)[];
}
