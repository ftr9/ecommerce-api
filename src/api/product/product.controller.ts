import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Products as ProductModel } from '@prisma/client';
import { ProductResponseInfoType } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { AddProductDto } from './dtos/AddProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { QueryParamDto } from './dtos/QueryParam.dto';
import { AuthGuard } from '../user/auth/guards/Auth.guard';
import { RolesGuard } from '../user/auth/guards/Roles.guard';
import { Roles } from '../user/auth/decorators/roles.decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@Query() query: QueryParamDto): Promise<ProductModel[]> {
    return this.productService.getProducts(query);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductModel> {
    return this.productService.getProduct(id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  addProduct(@Body() body: AddProductDto): Promise<ProductResponseInfoType> {
    return this.productService.addProduct(body);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<ProductModel> {
    return this.productService.updateProduct(id, body);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: number): Promise<ProductResponseInfoType> {
    return this.productService.deleteProduct(id);
  }
}
