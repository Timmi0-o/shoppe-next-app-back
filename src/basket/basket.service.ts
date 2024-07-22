import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { Product } from 'src/product/schemas/Product.schema';
import { CreateBasketDto } from './dtos/CreateBasket.dto';
import { DeleteProductToBasketDto } from './dtos/DeleteProductToBasket';
import { Basket } from './schemas/Basket.schema';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createBasket(userId: string) {
    try {
      // ПРОВЕРКА НАЛИЧИЯ ПОЛЬЗОВАТЕЛЯ
      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      const newBasketUser = new this.basketModel({
        user: userId,
      });
      return newBasketUser.save();
    } catch (error) {
      return error;
    }
  }

  async getBasket(userId: string) {
    try {
      if (!userId) {
        console.log('User is null');
        throw new HttpException('User is null', HttpStatus.BAD_REQUEST);
      }
      const userBasket = await this.basketModel
        .findOne({ user: userId })
        .exec();

      if (!userBasket) {
        throw new HttpException(
          'Ошибка получения корзины!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Извлечение массивов productId из корзины
      const productIds = userBasket.products.map(
        (productItem) => productItem.productId,
      );

      // Извлечение массивов qty из корзины
      const qtyProduct = userBasket.products.map(
        (productItem) => productItem.qty,
      );

      // Получение всех товаров по их id
      const fullProducts = await this.productModel
        .find({ _id: { $in: productIds } })
        .exec();

      // ПОЛНЫЕ ДАННЫЕ О ТОВАРАХ
      const fullProductDetails = [];
      for (let i: number = 0; i < fullProducts.length; i++) {
        fullProductDetails.push({
          product: fullProducts[i],
          qty: qtyProduct[i],
        });
      }

      const basketData = {
        user: userBasket.user,
        products: fullProductDetails,
      };

      return basketData;
    } catch (error) {
      throw error;
    }
  }

  async addProductToBasket(createBasketDto: CreateBasketDto) {
    try {
      // ПРОВЕРКА НАЛИЧИЯ ПОЛЬЗОВАТЕЛЯ И ТАКОГО ТОВАРА
      const user = await this.userModel
        .findOne({ _id: createBasketDto.user })
        .exec();

      const product = await this.productModel
        .findOne({
          _id: createBasketDto.product.productId,
        })
        .exec();

      if (!user) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }
      if (!product) {
        throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
      }

      // ЕСТЬ ЛИ УЖЕ ТАКОЙ ТОВАР В КОРЗИНЕ
      const addedProduct = await this.basketModel
        .findOne({
          user: user._id,
          products: {
            $elemMatch: { productId: createBasketDto.product.productId },
          },
        })
        .exec();

      if (addedProduct) {
        throw new HttpException(
          'Product already added!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        // ДОБАВЛЕНИЕ К УЖЕ СУЩ. КОРЗИНЫ ТОВАР
        const updateBasket = await this.basketModel
          .updateOne(
            { user: user._id },
            { $addToSet: { products: createBasketDto.product } },
          )
          .exec();

        return updateBasket;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductToBasket(deleteProduct: DeleteProductToBasketDto) {
    try {
      const user = await this.userModel
        .findOne({ _id: deleteProduct.idUser })
        .exec();
      const product = await this.productModel
        .findOne({ _id: deleteProduct.idProduct })
        .exec();

      if (!user || !product) {
        throw new HttpException('Operation is failed', HttpStatus.BAD_REQUEST);
      }

      return await this.basketModel.updateOne(
        { user: deleteProduct.idUser },
        { $pull: { products: { productId: deleteProduct.idProduct } } },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
