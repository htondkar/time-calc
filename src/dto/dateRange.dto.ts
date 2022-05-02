import { IsArray, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Planets } from 'src/domain/planetsAndNumbers';

export class DateRangePlanetsDTO {
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

export class DateRangeSinglePlanetDTO {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  planet: keyof Planets;
}
