import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/utils/jwt/jwt.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Request } from 'express';
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request: Request = context.switchToHttp().getRequest();
    if (
      request.headers.authorization &&
      request.headers.authorization.includes('Bearer')
    ) {
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken = await this.jwtService._verifyToken(token);
      const validUser = await this.prismaService.user.findUnique({
        where: {
          id: decodedToken?.id,
        },
      });
      if (!validUser) {
        throw new UnauthorizedException('user does not exists');
      }
      //add user to request object
      request.user = validUser;
    }
    return next.handle();
  }
}
