import { SetMetadata } from '@nestjs/common';

export const Roles = (arg: string) => SetMetadata('roles', arg);
