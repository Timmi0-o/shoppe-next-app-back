import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/auth/dtos/CreateUser.dto';
import { CreateProductDto } from 'src/product/dtos/CreateProduct.dto';

export class CreateReviewDto {
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @Type(() => CreateProductDto)
  product: CreateProductDto;

  @IsString()
  feedback: string;
}
