import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PriceService } from 'src/price/price.service';
import { PriceRangeDTO } from '../dto/PriceRange.dto';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post('/project-time-with-sq9')
  @UsePipes(new ValidationPipe({ transform: true }))
  priceRangeBasedCalculation(@Body() { startPrice, endPrice }: PriceRangeDTO) {
    return this.priceService.projectTimeWithSq9MaxDiff(startPrice, endPrice);
  }
}
