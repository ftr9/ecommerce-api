import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';
import { AuthInterceptor } from '../../common/interceptors/auth.interceptor';
import {
  AuthorizedUser,
  GuestUser,
} from '../../common/decorators/user.decorators';
import { AddCartDto } from './dots/AddCart.dto';
import { CartUpdateDto } from './dots/CartUpdate.dto';
import { CartService } from './cart.service';

@UseInterceptors(AuthInterceptor)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCarts(
    @AuthorizedUser() authorizedUser: User,
    @GuestUser() guestUser: Request['session'],
  ) {
    return this.cartService.getCart(authorizedUser, guestUser);
  }

  @Put(':id')
  updateCart(
    @Param('id') cardId: string,
    @Body() body: CartUpdateDto,
    @AuthorizedUser() authorizedUser: User,
    @GuestUser() guestUser: Request['session'],
  ) {
    return this.cartService.updateCart(cardId, body, authorizedUser, guestUser);
  }

  @Delete(':id')
  deleteCart(
    @Param('id') cardId: string | number,
    @AuthorizedUser() authorizedUser: User,
    @GuestUser() guestUser: Request['session'],
  ) {
    return this.cartService.deleteCart(cardId, authorizedUser, guestUser);
  }

  @Post()
  addToCart(
    @AuthorizedUser() authorizedUser: User,
    @GuestUser() guestUser: Request['session'],
    @Body() body: AddCartDto,
  ) {
    return this.cartService.addToCart(authorizedUser, guestUser, body);
  }
}
