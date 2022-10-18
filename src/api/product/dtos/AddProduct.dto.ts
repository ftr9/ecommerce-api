import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsPositive,
  MinLength,
  IsOptional,
  IsBoolean,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({}, { message: 'price must be a number' })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsBoolean()
  inStock: boolean;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  category: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];
}
