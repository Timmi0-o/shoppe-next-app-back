import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.Schema';
import { Product } from 'src/product/schemas/Product.Schema';
import { CreateBasketDto } from './dtos/CreateBasket.dto';
import { DeleteProductToBasketDto } from './dtos/DeleteProductToBasket.dto';
import { Basket } from './schemas/Basket.Schema';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // CREATE BASKET (IN LOGIN USER)
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

  // GET FULL BASKET
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

      if (userBasket?.products.length < 1) {
        throw new HttpException(
          'Array products is empty',
          HttpStatus.NOT_FOUND,
        );
      }

      // Извлечение массивов productId из корзины
      const productId = userBasket?.products.map(
        (productItem) => productItem.productId,
      );
      console.log('productId', productId);

      // Извлечение массивов qty из корзины
      const qtyProduct = userBasket?.products.map(
        (productItem) => productItem.qty,
      );
      console.log('qtyProduct', qtyProduct);

      // Получение всех товаров по их id
      const fullProducts = await this.productModel
        .aggregate([
          {
            $match: { _id: { $in: productId } },
          },
          {
            $addFields: {
              productIdOrder: {
                $indexOfArray: [productId, '$_id'],
              },
            },
          },
          {
            $sort: { productIdOrder: 1 },
          },
        ])
        .exec();

      // ПОЛНЫЕ ДАННЫЕ О ТОВАРАХ
      const fullProductDetails = [];
      for (let i: number = 0; i < productId.length; i++) {
        fullProductDetails[i] = {
          product: fullProducts[i],
          qty: qtyProduct[i],
        };
      }
      // console.log('fullProductDetails', fullProductDetails);
      return fullProductDetails;
    } catch (error) {
      throw error;
    }
  }

  // ADD PRODUCT IN BASKET
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
        throw new HttpException('No login!', HttpStatus.METHOD_NOT_ALLOWED);
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
      }
      // ДОБАВЛЕНИЕ К УЖЕ СУЩ. КОРЗИНЕ ТОВАР
      const updateBasket = await this.basketModel
        .updateOne(
          { user: user._id },
          { $addToSet: { products: createBasketDto.product } },
        )
        .exec();

      return updateBasket;
    } catch (error) {
      throw error;
    }
  }

  // DELETE PRODUCT IN BASKET
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

  // FIND PRODUCT IN BASKET BY PRODUCT ID
  async findProductInBasketById(idProduct: string, idUser: string) {
    if (!idProduct || !idUser) {
      throw new HttpException(
        'idProduct or idUser is null',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.userModel.findOne({ _id: idUser }).exec();
      if (!user) {
        throw new HttpException(
          'We is not login (no user)!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const product = await this.productModel
        .findOne({ _id: idProduct })
        .exec();
      if (!product) {
        throw new HttpException('Product not found!', HttpStatus.BAD_REQUEST);
      }

      const basket = await this.basketModel.find({ user: user._id }).exec();
      if (!basket) {
        throw new HttpException('Basket is not found!', HttpStatus.BAD_REQUEST);
      }

      const productInBasket = await this.basketModel
        .findOne({
          user: idUser,
          products: { $elemMatch: { productId: idProduct } },
        })
        .exec();

      if (!productInBasket?.products.length) {
        throw new HttpException(
          'Product is not in the basket!',
          HttpStatus.NOT_FOUND,
        );
      }
      const finishProduct = productInBasket?.products.filter(
        (product) => product.productId.toString() === idProduct,
      )[0];
      return finishProduct;
    } catch (error) {
      throw error;
    }
  }
}
