import { OrderStats } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderBodyDto {
  @IsNotEmpty()
  @IsEnum(OrderStats, {
    message:
      'invalid status provided valid status are notSeen,delivering,delivered,cancelled}',
  })
  orderstatus: OrderStats;
}
