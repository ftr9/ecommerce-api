import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Put,
  UseInterceptors,
  Delete,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { AuthorizedUser, GuestUser } from '../user/decorators/user.decorators';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { PlaceOrderBodyDto } from './dtos/PlaceOrderBody.dto';
import { OrderService } from './order.service';
import { AuthInterceptor } from '../user/auth/interceptors/auth.interceptor';
import { UpdateOrderBodyDto } from './dtos/UpdateOrder.dto';
import { Roles } from '../user/auth/decorators/roles.decorators';
import { RolesGuard } from '../user/auth/guards/Roles.guard';
import { AuthGuard } from '../user/auth/guards/Auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Get('user')
  getOrders(@AuthorizedUser() user: User) {
    return this.orderService.getOrders(user);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Put(':id')
  updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOrderBodyDto,
  ) {
    return this.orderService.updateOrder(id, body);
  }

  @Roles('USER')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  cancelOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @AuthorizedUser() user: User,
  ) {
    return this.orderService.cancelOrder(id, user);
  }

  @UseInterceptors(AuthInterceptor)
  @Post('checkout')
  async placeOrder(
    @AuthorizedUser() authorizedUser: User,
    @GuestUser() guestUser: Request['session'],
    @Body() body: PlaceOrderBodyDto,
    @Res() res: Response,
  ) {
    const order = await this.orderService.placeOrder(
      authorizedUser,
      guestUser,
      body,
      res,
    );
    res.status(201).json(order);
  }
}
