import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return `Server time and date is: ${new Date()}`;
  }
}
