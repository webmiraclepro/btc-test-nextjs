import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryDto } from './dto/query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get-score')
  getScore(@Query() queryDto: QueryDto) {
    return this.usersService.getScore(queryDto);
  }

  @Get('plus-score')
  plusScore(@Query() queryDto: QueryDto) {
    return this.usersService.plusScore(queryDto);
  }

  @Get('minus-score')
  minusScore(@Query() queryDto: QueryDto) {
    return this.usersService.minusScore(queryDto);
  }
}
