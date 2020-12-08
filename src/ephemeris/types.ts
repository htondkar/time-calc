import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsIn,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Planets } from 'src/ephemeris/planetsAndNumbers';

export class PriceRangeBasedCalcsDTO {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  startPrice: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  endPrice: number;

  @IsOptional()
  @IsArray()
  planets?: (keyof Planets)[];
}
