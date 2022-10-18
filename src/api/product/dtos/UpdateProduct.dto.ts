import {
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber({}, { message: 'price must be a number' })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsBoolean()
  inStock: boolean;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  category: string;
}
