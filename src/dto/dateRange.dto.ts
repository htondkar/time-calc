import { IsArray, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Planets } from 'src/domain/planetsAndNumbers';

export class DateRangeDTO {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsArray()
  planets: (keyof Planets)[];
}
