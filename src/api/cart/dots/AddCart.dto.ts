import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, IsPositive, ValidateNested } from 'class-validator';

class CartObjType {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class AddCartDto {
  @IsNotEmpty({ message: 'product id and quantity is required' })
  @ValidateNested({ each: true })
  @Type(() => CartObjType)
  cart: CartObjType;
}
