import {
  Injectable,
  NotFoundException,
  HttpException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from '../user/auth/auth.service';
import { placeOrderBodyType } from './interfaces/placeOrderBody.interface';
import { updateOrderBodyType } from './interfaces/updateOrderBody.interface';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { EmailService } from 'src/utils/email/email.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly emailSerice: EmailService,
  ) {}
  private readonly includeRelationProperty = {
    user: {
      select: {
        id: false,
        email: true,
      },
    },
  };
  async getOrders(user: User) {
    const userOrders = await this.prismaService.order.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    return userOrders;
  }

  async getAllOrders() {
    return await this.prismaService.order.findMany({
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async updateOrder(orderId: string, body: updateOrderBodyType) {
    //1.check if order exists
    const validOrder = await this._getValidOrder(orderId);
    if (!validOrder) {
      throw new NotFoundException('order doest not exists .');
    }

    //2. if order exists then update
    const updatedOrder = await this.prismaService.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: body.orderstatus,
      },
      include: this.includeRelationProperty,
    });

    //3 send the updated message email
    this.emailSerice._sendEmail({
      from: 'ADMIN',
      to: updatedOrder.user.email,
      subject: 'order status',
      message: `your order ${updatedOrder.id} status changed to ${updatedOrder.orderStatus}`,
      sentAt: new Date(),
    });

    return updatedOrder;
  }

  async cancelOrder(orderId: string, user: User) {
    //1. check if order exists
    const validOrder = await this._getValidOrder(orderId);
    if (!validOrder) {
      throw new NotFoundException(`order of id-${orderId} doest not exists`);
    }
    //2.check if order is delivered
    if (validOrder.orderStatus === 'delivered') {
      throw new MethodNotAllowedException(
        'order cannot be cancelled after the delivery sorry !!',
      );
    }

    //2.check if order is owned by user or not
    if (validOrder.user_id !== user.id) {
      throw new UnauthorizedException(
        'you are not issuer of this order sorry !!',
      );
    }

    //3. update the order
    const updatedOrder = await this.prismaService.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: 'cancelled',
      },
      include: this.includeRelationProperty,
    });

    //4. send the updated email
    this.emailSerice._sendEmail({
      from: updatedOrder.user.email,
      to: 'ADMIN',
      subject: 'order status',
      message: `the order ${updatedOrder.id} is cancelled by user`,
      sentAt: new Date(),
    });
    return updatedOrder;
  }

  async placeOrder(
    authorizedUser: User,
    guestUser: Request['session'],
    orderBody: placeOrderBodyType,
    res: Response,
  ) {
    if (orderBody.shipToDifferentAddress && !orderBody.shippingInfo) {
      throw new HttpException('please provide shipping information', 400);
    }

    if (authorizedUser) {
      //this is for authorized
      return await this._placeAuthorizedOrder(authorizedUser, orderBody, res);
    } else {
      return await this._placeGuestOrder(guestUser, orderBody, res);
    }
  }

  async _getValidOrder(orderId: string) {
    const validOrder = await this.prismaService.order.findUnique({
      where: {
        id: orderId,
      },
    });
    return validOrder;
  }

  async _placeAuthorizedOrder(
    authorizedUser: User,
    orderBody: placeOrderBodyType,
    res: Response,
  ) {
    try {
      //1. get cart items
      const cartItems = (await this.prismaService.cart.findMany({
        where: {
          user_id: authorizedUser.id,
        },
        select: {
          product: true,
        },
      })) as Prisma.JsonArray;
      if (cartItems.length === 0) throw new HttpException('cart is empty', 404);

      //2.calculate total price to be paid
      const {
        _sum: { total_price },
      } = await this.prismaService.cart.aggregate({
        _sum: {
          total_price: true,
        },
      });

      //3. create order
      const order = this.prismaService.order.create({
        data: {
          user_id: authorizedUser.id,
          totalCost: total_price,
          products: cartItems,
          shipping_info: orderBody.shipToDifferentAddress
            ? orderBody.shippingInfo
            : undefined,
        },
      });
      //4. Empty out the cart
      await this.prismaService.cart.deleteMany({
        where: {
          user_id: authorizedUser.id,
        },
      });
      return order;
    } catch (err) {
      this._handlePlaceOrderError(err, res);
    }
  }

  async _placeGuestOrder(
    guestUser: Request['session'],
    orderBody: placeOrderBodyType,
    res: Response,
  ) {
    try {
      if (!guestUser.carts || guestUser.carts.length === 0) {
        throw new HttpException('guest user cart is empty.', 404);
      }
      if (!orderBody.userInfo) {
        throw new HttpException(
          'please provide user information if not logged in',
          404,
        );
      }
      //1.sign up user
      const user = await this.authService.signup(orderBody.userInfo);
      //2 calculate total cost from users session
      const totalProductsCost = guestUser.carts.reduce(
        (sum, cartItem) => sum + cartItem.product.total_price,
        0,
      );
      //3. get products from  cart
      const cartProducts = guestUser.carts.map(
        (cart) => cart.product,
      ) as Prisma.JsonArray;

      //4.store in orders table
      const order = await this.prismaService.order.create({
        data: {
          user_id: user['user'].data.id,
          totalCost: totalProductsCost,
          products: cartProducts,
          shipping_info: orderBody.shipToDifferentAddress
            ? orderBody.shippingInfo
            : undefined,
        },
      });

      //5.destroy session
      await this.prismaService.guestSession.delete({
        where: {
          session_id: guestUser.id,
        },
      });
      return order;
    } catch (err) {
      this._handlePlaceOrderError(err, res);
    }
  }

  _handlePlaceOrderError(err, res: Response) {
    res.status(err.status).json({
      statusCode: err.status,
      message: err.response,
    });
  }
}
