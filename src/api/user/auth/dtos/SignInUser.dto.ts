import { IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
