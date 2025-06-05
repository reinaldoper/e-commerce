import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateItemDto {
  @ApiProperty({ required: true })
  productId: number;

  @ApiProperty({ required: true })
  quantity: number;

  @ApiProperty({ required: false })
  order: Prisma.OrderCreateNestedOneWithoutItemsInput;

  @ApiProperty({ required: true })
  orderId: number;

  @ApiProperty({ required: false })
  price: number;

  @ApiProperty({ required: false })
  product: Prisma.ProductCreateNestedOneWithoutOrdersItemInput;
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
  @ApiProperty({ required: false })
  order?: Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput;
  @ApiProperty({ required: false })
  product?: Prisma.ProductUpdateOneRequiredWithoutOrdersItemNestedInput;
}
