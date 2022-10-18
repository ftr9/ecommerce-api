import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { UtilsModule } from 'src/utils/utils.module';
@Module({
  imports: [PrismaModule, ProductModule, UtilsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
