import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { Product } from './schemas/Product.Schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  getAllProduct() {
    return this.productModel.find();
  }

  createProduct(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel(createProductDto);
    newProduct.save();
    console.log('-------------------------');
    console.log(newProduct);
    console.log('-------------------------');
    return newProduct;
  }

  getProductById(id: string) {
    console.log(id);
    return this.productModel.findById(id);
  }
}
