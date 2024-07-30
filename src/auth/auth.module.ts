import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { OrderModule } from 'src/order/order.module';
import { BasketModule } from '../basket/basket.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/User.Schema';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.register({ secret: 'timmy', signOptions: { expiresIn: '1d' } }),
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BasketModule,
    OrderModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
