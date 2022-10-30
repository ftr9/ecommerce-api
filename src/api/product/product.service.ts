import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  productBodyType,
  UpdateBodyType,
  QueryParamType,
} from './interfaces/product.interface';
@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly findQueryIncludeOption = {
    images: {
      select: {
        url: true,
      },
    },
  };
  //@Get()
  async getProducts(query: QueryParamType) {
    const products = await this.prismaService.products.findMany({
      take: query.limit ? query.limit : 10,
      skip: query.skip ? query.skip : 0,
      where: {
        category: query.category,
        price: query.price,
      },
      include: { ...this.findQueryIncludeOption },
    });
    if (products.length === 0) throw new NotFoundException();
    return products.map((product) => ({
      ...product,
      images: product.images[0],
    }));
  }

  //@Get(:id)
  async getProduct(productId: number) {
    const product = await this.prismaService.products.findUnique({
      where: {
        id: productId,
      },
      include: { ...this.findQueryIncludeOption },
    });
    if (!product) {
      throw new NotFoundException(`product of id-${productId} does not exists`);
    }
    return product;
  }

  //@Post()
  async addProduct(productBody: productBodyType) {
    //1.insert product to products table
    try {
      const addedProducts = await this.prismaService.products.create({
        data: {
          name: productBody.name,
          description: productBody.description,
          price: productBody.price,
          category: productBody.category,
        },
      });

      const mappedDbImageType = productBody.images.map((image) => ({
        ...image,
        productId: addedProducts.id,
      }));
      //2.insert images to image table
      await this.prismaService.images.createMany({
        data: mappedDbImageType,
      });

      return {
        status: 'success',
        message: `product added successfully with id-${addedProducts.id}`,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException('product name already exists', 400);
        }
      } else {
        throw new HttpException('something went wrong', 500);
      }
    }
  }

  //@Put(:id)
  async updateProduct(productId: number, body: UpdateBodyType) {
    const validProduct = await this.getProduct(productId);
    const updatedProduct = await this.prismaService.products.update({
      where: {
        id: validProduct.id,
      },
      data: body,
    });
    return updatedProduct;
  }

  //@Delete(:id)
  async deleteProduct(productId: number) {
    const validProduct = await this.getProduct(productId);
    const deletedProduct = await this.prismaService.products.delete({
      where: {
        id: validProduct.id,
      },
    });
    return {
      status: 'success',
      message: `product deleted successfully of id-${deletedProduct.id}`,
    };
  }
}
