import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message: 'please provide valid email address',
    },
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('NP')
  phone: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  postcode: number;

  @IsNotEmpty()
  @IsString()
  address_district: string;

  @IsNotEmpty()
  @IsString()
  address_municipality: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  address_ward: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
