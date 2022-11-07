import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/RegisterUser.dto';
import { SignInUserDto } from './dtos/SignInUser.dto';
import { AuthService } from './auth.service';

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

  @Post('logout')
  logout() {
    return this.authService.logout();
  }
}
