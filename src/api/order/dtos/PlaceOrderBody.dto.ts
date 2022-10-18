import {
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsString,
  IsPositive,
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterUserDto } from 'src/api/user/auth/dtos/RegisterUser.dto';

class shippingObjType {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('NP')
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  postCode: number;

  @IsNotEmpty()
  @IsString()
  address_district: string;

  @IsNotEmpty()
  @IsString()
  address_municipality: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  address_ward: number;
}

export class PlaceOrderBodyDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => shippingObjType)
  shippingInfo: shippingObjType;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RegisterUserDto)
  userInfo: RegisterUserDto;

  @IsNotEmpty()
  @IsBoolean()
  shipToDifferentAddress: boolean;
}
