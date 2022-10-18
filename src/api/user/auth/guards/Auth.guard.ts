import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/utils/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
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
      return true;
    } else {
      throw new UnauthorizedException('user is not logged in ');
    }
  }
}
