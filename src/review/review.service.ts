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
    console.log('isReview', isReview);
    if (isReview) {
      throw new HttpException(
        { message: 'Вы уже оставляли комментарий на этот товар' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async getReviewsByProduct(id: string) {
    const reviews = await this.reviewModel
      .find({ product: id })
      .populate('user')
      .exec();
    return reviews;
  }

  async getReviewByUser(idUser: string, idProduct: string) {
    const review = await this.reviewModel
      .findOne({ user: idUser, product: idProduct })
      .exec();
    return review;
  }
}
