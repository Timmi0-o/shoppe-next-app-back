import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getAllProduct() {
    return this.productService.getAllProduct();
  }

  @Post('create')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
}
