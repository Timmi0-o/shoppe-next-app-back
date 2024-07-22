import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class ProductItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @IsOptional()
  qty?: number;
}

export class CreateBasketDto {
  @IsMongoId()
  user: string;

  @IsOptional()
  product: ProductItemDto;
}
