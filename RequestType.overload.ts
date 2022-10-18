import { Request } from 'express';
import { User } from '@prisma/client';
export = Request;
declare module 'express' {
  interface Request {
    user: User;
  }
}
