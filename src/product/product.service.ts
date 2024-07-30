import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { Product } from './schemas/Product.Schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getAllProduct() {
    return await this.productModel.find().exec();
  }

  createProduct(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel(createProductDto);
    newProduct.save();
    console.log(newProduct);
    return newProduct;
  }

  async getProductById(id: string) {
    try {
      if (!id) {
        throw new HttpException(
          'Product is not defined!',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpException(
          'Product id is not valid!',
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.productModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.log('ОШИБКА В "PRODUCT SERVICE getProductById"');
      console.log(error);
    }
  }
}
