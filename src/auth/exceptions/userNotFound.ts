import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('Такого пользователя нет!', HttpStatus.NOT_FOUND);
  }
}
