import { Module } from '@nestjs/common';
import { JwtService } from './jwt/jwt.service';
import { EmailService } from './email/email.service';
@Module({
  exports: [JwtService, EmailService],
  providers: [JwtService, EmailService],
})
export class UtilsModule {}
