import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dtos/CreateReview.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get(':id')
  getReviewsByProduct(@Param('id') id: string) {
    return this.reviewService.getReviewsByProduct(id);
  }

  @Get(':idProduct/:idUser')
  getReviewByUser(
    @Param('idUser') idUser: string,
    @Param('idProduct') idProduct: string,
  ) {
    return this.reviewService.getReviewByUser(idUser, idProduct);
  }
}
