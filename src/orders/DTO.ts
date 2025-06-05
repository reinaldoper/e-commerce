import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({ required: true })
  userId: number;
  @ApiProperty({ required: false })
  user: Prisma.UserCreateNestedOneWithoutOrdersInput;
  @ApiProperty({ required: false })
  items?: Prisma.OrderItemCreateNestedManyWithoutOrderInput;
}
export class UpdateOrderDto {
  @ApiProperty({ required: false })
  userId?: number;
  @ApiProperty({ required: false })
  user?: Prisma.UserUpdateOneRequiredWithoutOrdersNestedInput;
  @ApiProperty({ required: false })
  items?: Prisma.OrderItemUpdateManyWithoutOrderNestedInput;
}
