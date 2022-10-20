import {
  IsOptional,
  IsNumber,
  ValidateNested,
  IsString,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
class priceObjDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  gte: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  lte: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  gt: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  lt: number;
}

export class QueryParamDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => priceObjDto)
  price: priceObjDto;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  skip: number;
}
