import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dtos/CreateReview.dto';
import { Review } from './schemas/Review.Schema';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async createReview(createReviewDto: CreateReviewDto) {
    const isReview = await this.reviewModel.findOne({
      product: createReviewDto.product,
      user: createReviewDto.user,
    });

    if (isReview) {
      throw new HttpException(
        'Вы уже оставляли комментарий на этот товар, хотите отредактировать его?',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdReview = new this.reviewModel(createReviewDto);
    console.log('------------------------------');
    console.log(`Отзыв о товаре: ${createdReview}`);
    console.log('------------------------------');

    return createdReview.save();
  }

  async getReviewsByProduct(id: string) {
    const reviews = await this.reviewModel
      .find({ product: id })
      .populate('user')
      .exec();
    console.log('------------------------------');
    console.log(`Отзывы о товаре: ${reviews}`);
    console.log('------------------------------');
    return reviews;
  }
}
