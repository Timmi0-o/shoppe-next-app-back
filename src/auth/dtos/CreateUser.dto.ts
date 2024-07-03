import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}
