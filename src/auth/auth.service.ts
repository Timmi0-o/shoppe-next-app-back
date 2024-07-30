import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { OrderService } from 'src/order/order.service';
import { BasketService } from '../basket/basket.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './schemas/User.Schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private basketService: BasketService,
    private orderService: OrderService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException(
        {
          message: 'Такого пользователя нет',
        },
        404,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    console.log('Валидация успешна');
    return null;
  }

  async loginUser(req: Request, user: any) {
    const payload = { username: user.username, id: user._id };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async userData(token: string) {
    if (!token) {
      throw new HttpException({ message: 'Токен отсутствует!' }, 403);
    }
    try {
      const userData = await this.jwtService.verify(token, {
        secret: 'timmy',
      });

      if (userData) {
        const nowUser = await this.userModel.findOne({
          username: userData.username,
        });

        if (!nowUser) {
          throw new HttpException({ message: 'Такого пользователя нет' }, 404);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = nowUser.toObject();
        return result;
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException({ message: 'Срок действия токена истек' }, 403);
      } else {
        throw new HttpException(
          {
            message: 'Недействительный токен',
          },

          403,
        );
      }
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const alreadyUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (alreadyUser) {
      return new HttpException(
        {
          message:
            'Такой пользователь уже есть, пожалуйста, войдите в аккаунт!',
        },
        403,
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    console.log('Успешная регистрация');

    await newUser.save();
    await this.basketService.createBasket(newUser._id.toString());
    return await this.orderService.createOrder(newUser._id.toString());
  }
}
