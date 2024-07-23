import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { BasketService } from '../basket/basket.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './schemas/User.Schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private basketService: BasketService,
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
      const { password, ...result } = user.toObject();
      return result;
    }
    console.log('Валидация успешна');
    return null;
  }

  async loginUser(user: any) {
    const payload = { username: user.username, id: user._id };
    const token = this.jwtService.sign(payload);
    return { token, user: user.username };
  }

  async userData(token: string) {
    if (!token) {
      throw new HttpException({ message: 'Токен отсутствует!' }, 403);
    }
    try {
      const userData = await this.jwtService.verify(token, {
        secret: 'timmy',
      });

      const nowUser = await this.userModel.findOne({
        username: userData.username,
      });

      if (!nowUser) {
        throw new HttpException({ message: 'Такого пользователя нет' }, 404);
      }
      const { password, ...result } = nowUser.toObject();
      return result;
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
    return await this.basketService.createBasket(newUser._id.toString());

    // const user = {
    //   username: createUserDto.username,
    //   id: newUser._id,
    // };

    // return this.loginUser(user);
  }
}
