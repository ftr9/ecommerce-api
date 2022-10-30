import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  exports: [AuthService],
  imports: [PrismaModule, UtilsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
