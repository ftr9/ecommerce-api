import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { SignInUserDto } from './dtos/SignInUser.dto';
import { AuthService } from './auth.service';
import { signResponseType } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: RegisterUserDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signIn(@Body() body: SignInUserDto) {
    return this.authService.signIn(body);
  }
}