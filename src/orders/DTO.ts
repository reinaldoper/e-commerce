import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ required: true })
  userId: number;
}
export class UpdateOrderDto {
  @ApiProperty({ required: false })
  userId?: number;
}
