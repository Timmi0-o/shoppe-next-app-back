import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { generateUniqueNumber } from 'src/utils/GenerateRandom13Number';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { Order } from './schemas/Order.Schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // CREATE ORDER (IN LOGIN USER)
  async createOrder(userId: string) {
    try {
      // ПРОВЕРКА НАЛИЧИЯ ПОЛЬЗОВАТЕЛЯ
      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new HttpException('No login!', HttpStatus.METHOD_NOT_ALLOWED);
      }
      const newOrderUser = new this.orderModel({
        user: userId,
      });
      return newOrderUser.save();
    } catch (error) {
      return error;
    }
  }

  // GET ALL ORDERS
  async getAllOrders(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HttpException('User not valid!', HttpStatus.BAD_REQUEST);
    }
    try {
      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new HttpException('No login!', HttpStatus.METHOD_NOT_ALLOWED);
      }
      const ordersUser = await this.orderModel
        .findOne({
          user: userId,
        })
        .exec();

      if (!ordersUser) {
        throw new HttpException('Order not found!', HttpStatus.NO_CONTENT);
      }
      return ordersUser;
    } catch (error) {
      console.log(error);
    }
  }

  // GET ONE ORDER
  async getOrder(userId: string, numberOrder: string) {
    try {
      // GET USER
      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new HttpException('No login!', HttpStatus.METHOD_NOT_ALLOWED);
      }
      // GET ORDER
      const order = await this.orderModel
        .findOne({
          user: userId,
          'orders.number': numberOrder,
        })
        .exec();
      if (!order) {
        throw new HttpException('Order not found!', HttpStatus.NO_CONTENT);
      }

      // Найти конкретный заказ в массиве orders
      const concreteOrder = order.orders.find(
        (order) => order.number === numberOrder,
      );
      if (!concreteOrder) {
        throw new HttpException('Order not found!', HttpStatus.NO_CONTENT);
      }

      return concreteOrder;
    } catch (error) {
      console.log(error);
    }
  }

  // ADDED ORDER
  async addOrder(createOrderDto: CreateOrderDto) {
    console.log('createOrderDto', createOrderDto);
    try {
      const user = await this.userModel
        .findOne({ _id: createOrderDto.user })
        .exec();
      if (!user) {
        throw new HttpException('No login!', HttpStatus.UNAUTHORIZED);
      }
      if (createOrderDto.productList.length < 1) {
        throw new HttpException('Products not found!', HttpStatus.NO_CONTENT);
      }
      // CUT USER DATA
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user: userId, ...orderData } = createOrderDto;

      console.log('orderData.productList', orderData.productList);

      // GENERATE UNIQUE NUMBER
      const number = generateUniqueNumber();

      const newOrderData = { number, ...orderData };
      console.log('newOrderData', newOrderData);

      // Добавление заказа в массив orders пользователя
      await this.orderModel
        .updateOne(
          { user: createOrderDto.user },
          { $push: { orders: newOrderData } },
        )
        .exec();

      return number;
    } catch (error) {
      console.error(error);
    }
  }
}
