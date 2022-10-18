import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CartUpdateDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
