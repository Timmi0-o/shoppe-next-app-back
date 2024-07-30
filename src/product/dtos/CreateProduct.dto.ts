import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ProductSettingDto } from './ProductSetting.dto';

export class CreateProductDto {
  @IsString()
  title: string;

  price: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  fullDescription?: string;

  @IsOptional()
  @Type(() => ProductSettingDto)
  action: ProductSettingDto;
}
