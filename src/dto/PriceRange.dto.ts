import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceRangeDTO {
  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  startPrice: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  endPrice: number;
}
