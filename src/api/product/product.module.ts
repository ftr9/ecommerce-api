import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';
@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
