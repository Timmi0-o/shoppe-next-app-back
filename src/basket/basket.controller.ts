import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dtos/CreateBasket.dto';
import { DeleteProductToBasketDto } from './dtos/DeleteProductToBasket.dto';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Get(':userId')
  getUserBasket(@Param('userId') userId: string) {
    return this.basketService.getBasket(userId);
  }

  @Patch('add-product')
  addProductToBasket(@Body() createBasketDto: CreateBasketDto) {
    return this.basketService.addProductToBasket(createBasketDto);
  }

  @Delete('delete-product')
  deleteProductToBasket(@Body() deleteProduct: DeleteProductToBasketDto) {
    return this.basketService.deleteProductToBasket(deleteProduct);
  }

  @Get(':idProduct/:idUser')
  findProductInBasketByID(
    @Param('idProduct') idProduct: string,
    @Param('idUser') idUser: string,
  ) {
    return this.basketService.findProductInBasketById(idProduct, idUser);
  }
}
