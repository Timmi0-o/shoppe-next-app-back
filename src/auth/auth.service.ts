import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { User } from './schemas/User.Schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('Такого пользователя нет', 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async loginUser(user: any) {
    const payload = { username: user.username, id: user._id };
    const token = this.jwtService.sign(payload);
    return { token, user: user.username };
  }

  async userData(token: { token: string }) {
    if (!token.token) {
      throw new HttpException('Токен отсутствует!', 403);
    }
    console.log(token);

    try {
      const userData = await this.jwtService.verify(token.token, {
        secret: 'timmy',
      });

      const nowUser = await this.userModel.findOne({
        username: userData.username,
      });

      if (!nowUser) {
        throw new HttpException('Такого пользователя нет', 404);
      }
      return nowUser;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Срок действия токена истек:', error.message);
        throw new HttpException('Срок действия токена истек', 403);
      } else {
        console.error('Недействительный токен:', error.message);
        throw new HttpException('Недействительный токен', 403);
      }
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    const alreadyUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (alreadyUser) {
      return new HttpException(
        'Такой пользователь уже есть, пожалуйста, войдите в аккаунт!',
        403,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    console.log('Успешная регистрация');
    newUser.save();
    const user = {
      username: createUserDto.username,
      id: newUser._id,
    };
    return this.loginUser(user);
  }
}
