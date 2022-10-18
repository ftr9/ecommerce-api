//library
import {
  Injectable,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
//self coded
import { JwtService } from 'src/utils/jwt/jwt.service';
import {
  signUpBodyType,
  signResponseType,
  signInBodyType,
} from './interfaces/auth.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signup(body: signUpBodyType) {
    try {
      //1. hash the password
      body.password = await bcrypt.hash(body.password, 10);

      //2.store the user in DB
      const user = await this.prismaService.user.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          postcode: body.postcode,
          address_district: body.address_district,
          address_municipality: body.address_municipality,
          address_ward: body.address_ward,
          passsword: body.password,
        },
      });
      user.passsword = undefined;
      //3. generare login to continue
      return {
        status: 'success',
        user: {
          data: user,
        },
        message: 'please login to continue',
      };
    } catch (err) {
      this._catchSignUpError(err);
    }
  }

  async signIn(body: signInBodyType) {
    //1.check if user with that email exists in DB
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('invalid username or password');
    }
    //2. check the password
    const isCorrectPassword = await bcrypt.compare(
      body.password,
      user.passsword,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException('invalid username or password');
    }

    //3.generate the token
    const jwtToken = this.jwtService._generateToken({
      id: user.id,
      name: user.name,
    });
    return {
      token: jwtToken,
    };
  }

  _catchSignUpError(err) {
    const isPrismaError = err instanceof PrismaClientKnownRequestError;
    const isDuplicateError = err.code === 'P2002';

    if (isPrismaError && isDuplicateError) {
      const targetField: { target?: string } = err.meta;
      const targetFieldName = targetField.target.split('_')[1];
      throw new HttpException(`${targetFieldName} already exists.`, 400);
    } else {
      throw new InternalServerErrorException('Opps ! something went wrong');
    }
  }
}
