import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Planets } from '../domain/planetsAndNumbers';
import { PriceRangeDTO } from './PriceRange.dto';

export class PriceAndDateRangeBasedCalcsDTO extends PriceRangeDTO {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsArray()
  planets?: (keyof Planets)[];

  @IsOptional()
  @IsBoolean()
  movePlanetsFromStartOfTheRange?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  ratios?: number[];
}
