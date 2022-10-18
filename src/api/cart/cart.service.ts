import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { AddCartBodyInterface } from './interfaces/cart.interface';
import { ProductResponseBodyTypeId } from '../product/interfaces/product.interface';

import {
  CartResponseGuestDto,
  CartResponseAuthctdDto,
} from './dots/CartResponse.dto';

import { ProductService } from '../product/product.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CartService {
  constructor(
    private readonly productService: ProductService,
    private readonly prismaService: PrismaService,
  ) {}

  //@Post()
  async addToCart(
    authorizedUser: User,
    guestUser: Request['session'],
    body: AddCartBodyInterface,
  ) {
    const validProduct = await this.productService.getProduct(body.cart.id);
    if (authorizedUser) {
      return this._authorizedAddToCart(authorizedUser, validProduct, body);
    } else {
      return this._guestAddToCart(guestUser, validProduct, body);
    }
  }

  //Get()
  async getCart(authorizedUser: User, guestUser: Request['session']) {
    if (authorizedUser) {
      const cartItems = await this.prismaService.cart.findMany({
        where: {
          user_id: authorizedUser.id,
        },
        include: {
          product: true,
        },
      });
      if (cartItems.length === 0) {
        throw new NotFoundException('cart is empty');
      }
      return cartItems.map((cart) => new CartResponseAuthctdDto(cart));
    } else {
      if (!guestUser.carts || guestUser.carts.length === 0) {
        throw new NotFoundException('cart is empty');
      }
      return guestUser.carts.map((cart) => new CartResponseGuestDto(cart));
    }
  }

  //@Delete()
  async deleteCart(
    cartId: number | string,
    authorizedUser: User,
    guestUser: Request['session'],
  ) {
    if (authorizedUser) {
      const cartIdNum = parseInt(cartId.toString());
      const validCart = await this.prismaService.cart.findFirst({
        where: {
          AND: [
            {
              id: isNaN(cartIdNum) ? -1 : cartIdNum,
            },
            { user_id: authorizedUser.id },
          ],
        },
      });

      if (!validCart) {
        throw new NotFoundException(`Cart of id-${cartId} not exists `);
      }

      const removedCart = await this.prismaService.cart.delete({
        where: {
          id: validCart.id,
        },
      });
      return {
        status: 'success',
        message: `product deleted successfully of id-${removedCart.id}`,
      };
    } else {
      if (!guestUser.carts) {
        throw new NotFoundException('cart is empty');
      }
      guestUser.carts = guestUser.carts.filter(
        (cart) => cart.cart_id !== cartId,
      );
      if (guestUser.carts.length === 0)
        throw new NotFoundException('cart is empty');
      return guestUser.carts.map((cart) => new CartResponseGuestDto(cart));
    }
  }

  //@Put()
  async updateCart(
    cartId: string | number,
    body: { quantity: number },
    authorizedUser: User,
    guestUser: Request['session'],
  ) {
    if (authorizedUser) {
      const cartIdNum = parseInt(cartId.toString());
      const validCart = await this.prismaService.cart.findFirst({
        where: {
          AND: [
            {
              id: isNaN(cartIdNum) ? -1 : cartIdNum,
            },
            {
              user_id: authorizedUser.id,
            },
          ],
        },
        include: {
          product: true,
        },
      });
      if (!validCart) {
        throw new NotFoundException(`cart of id-${cartId} does not exists`);
      }
      const updatedCart = await this.prismaService.cart.update({
        where: {
          id: validCart.id,
        },
        data: {
          quantity: body.quantity,
          total_price: body.quantity * validCart.product.price,
        },
      });
      return updatedCart;
    } else {
      if (!guestUser.carts) {
        throw new NotFoundException('cart is empty');
      }
      const cartItem = guestUser.carts.find((cart) => cart.cart_id === cartId);
      if (!cartItem) {
        throw new NotFoundException(`cart id-${cartId} does not exists`);
      }
      const updatedCartItem = guestUser.carts.map((cart) => {
        if (cart.cart_id === cartId) {
          cart.product.quantity = body.quantity;
          cart.product.total_price = body.quantity * cart.product.price;
          cartItem.product.quantity = body.quantity;
          cartItem.product.total_price = body.quantity * cart.product.price;
        }
        return cart;
      });
      guestUser.carts = updatedCartItem;
      return new CartResponseGuestDto(cartItem);
    }
  }

  async _authorizedAddToCart(
    authorizedUser: User,
    validProduct: ProductResponseBodyTypeId,
    body: AddCartBodyInterface,
  ) {
    const addedCart = await this.prismaService.cart.create({
      data: {
        product_id: validProduct.id,
        user_id: authorizedUser.id,
        quantity: body.cart.quantity,
        total_price: validProduct.price * body.cart.quantity,
      },
    });
    return { status: 'added to cart successfully', addedCart };
  }

  _guestAddToCart(
    guestUser: Request['session'],
    product: ProductResponseBodyTypeId,
    body: AddCartBodyInterface,
  ) {
    const cartItem = {
      cart_id: uuid(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        inStock: product.inStock,
        quantity: body.cart.quantity,
        total_price: body.cart.quantity * product.price,
        category: product.category,
        image: product.images[0].url,
      },
    };
    //modifying the session
    if (!guestUser.carts) {
      guestUser.carts = [];
    }
    guestUser.carts.push(cartItem);

    return { status: 'added to cart successfully', cartItem };
  }
}
