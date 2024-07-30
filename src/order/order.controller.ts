import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get(':userId')
  async getOrdersUser(@Param('userId') userId: string) {
    return await this.orderService.getAllOrders(userId);
  }

  @Get(':userId/:numberOrder')
  async getOneOrder(
    @Param('userId') userId: string,
    @Param('numberOrder') numberOrder: string,
  ) {
    return await this.orderService.getOrder(userId, numberOrder);
  }

  @Patch('add')
  async addOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.addOrder(createOrderDto);
  }
}
