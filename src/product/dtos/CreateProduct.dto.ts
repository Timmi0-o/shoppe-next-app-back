import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  price: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  fullDescription?: string;
}
