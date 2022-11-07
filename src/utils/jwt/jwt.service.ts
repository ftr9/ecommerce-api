import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtPayloadType } from './jwt.interface';
export class JwtService {
  _generateToken(jwtPayload: jwtPayloadType): string {
    return jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: '10h',
    });
  }

  _expireToken() {
    return { token: '' };
  }

  async _verifyToken(jwtToken: string): Promise<jwt.JwtPayload> {
    try {
      const verifiedJwtPayload = jwt.verify(
        jwtToken,
        process.env.JWT_SECRET,
      ) as jwt.JwtPayload;
      return verifiedJwtPayload;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        switch (err.name) {
          case 'JsonWebTokenError':
            throw new UnauthorizedException(
              'Invalid token please provide correct token',
            );
          case 'TokenExpiredError':
            throw new UnauthorizedException(
              'Token expired please signin again',
            );
          default: {
            throw new InternalServerErrorException('something went wrong');
          }
        }
      }
    }
  }
}
