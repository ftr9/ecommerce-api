import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './api/product/product.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CartModule } from './api/cart/cart.module';
import { UserModule } from './api/user/user.module';
import { UtilsModule } from './utils/utils.module';
import { OrderModule } from './api/order/order.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core/constants';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ProductModule,
    PrismaModule,
    CartModule,
    UserModule,
    UtilsModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
