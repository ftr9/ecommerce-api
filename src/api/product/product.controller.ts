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
import { ProductService } from './product.service';
import { AddProductDto } from './dtos/AddProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { QueryParamDto } from './dtos/QueryParam.dto';
import { AuthGuard } from '../../common/guards/Auth.guard';
import { RolesGuard } from '../../common/guards/Roles.guard';
import { Roles } from '../../common/decorators/roles.decorators';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(@Query() query: QueryParamDto) {
    return this.productService.getProducts(query);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProduct(id);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post()
  addProduct(@Body() body: AddProductDto) {
    return this.productService.addProduct(body);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, body);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
