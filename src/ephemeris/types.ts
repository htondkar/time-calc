import { IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

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
}
