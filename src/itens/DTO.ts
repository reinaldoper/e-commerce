import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ required: true })
  productId: number;

  @ApiProperty({ required: true })
  quantity: number;

  @ApiProperty({ required: true })
  orderId: number;

  @ApiProperty({ required: false })
  price: number;
}

export class UpdateItemDto {
  @ApiProperty({ required: false })
  quantity?: number;
  @ApiProperty({ required: false })
  orderId?: number;
  @ApiProperty({ required: false })
  productId?: number;
  @ApiProperty({ required: false })
  price?: number;
}
