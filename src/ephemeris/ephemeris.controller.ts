import { Controller, Get } from '@nestjs/common';
import { EphemerisService } from 'src/ephemeris/ephemeris.service';

@Controller('ephemeris')
export class EphemerisController {
  constructor(private readonly ephemerisService: EphemerisService) {}

  @Get('/')
  index() {
    return this.ephemerisService.getTodaysEphemeris();
  }
}
