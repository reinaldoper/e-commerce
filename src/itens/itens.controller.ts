import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItensService } from './itens.service';
import { Prisma } from '@prisma/client';
import { ItemSchema } from './dto.itens';

@Controller('itens')
@ApiTags('itens')
export class ItensController {
  constructor(private readonly itensService: ItensService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({
    status: 201,
    description: 'Item created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  async createItem(@Body() itemData: Prisma.OrderItemCreateInput) {
    const itemSchema = ItemSchema.safeParse(itemData);
    if (!itemSchema.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: itemSchema.error.errors,
      });
    }
    const item = await this.itensService.createItem(itemData);
    return {
      statusCode: 201,
      message: 'Item created successfully',
      data: item,
    };
  }

  @Get('order/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all items by order id' })
  @ApiResponse({
    status: 200,
    description: 'Items found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No items found for this order.',
  })
  async findItemsByOrderId(@Param('orderId') orderId: string) {
    const items = await this.itensService.findItemsByOrderId(Number(orderId));
    if (!items || items.length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'No items found for this order',
      });
    }
    return {
      statusCode: 200,
      message: 'Items found successfully',
      data: items,
    };
  }
  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find all items by product id' })
  @ApiResponse({
    status: 200,
    description: 'Items found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No items found for this product.',
  })
  async findItemsByProductId(@Param('productId') productId: string) {
    const items = await this.itensService.findItemsByProductId(
      Number(productId),
    );
    if (!items || items.length === 0) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'No items found for this product',
      });
    }
    return {
      statusCode: 200,
      message: 'Items found successfully',
      data: items,
    };
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Item found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  async findItemById(@Param('id') id: string) {
    const item = await this.itensService.findItemById(Number(id));
    if (!item) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Item not found',
      });
    }
    return {
      statusCode: 200,
      message: 'Item found successfully',
      data: item,
    };
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an order item' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  async updateItem(
    @Body() itemData: Prisma.OrderItemUpdateInput,
    @Param('id') id: string,
  ) {
    const itemSchema = ItemSchema.safeParse(itemData);
    if (!itemSchema.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: itemSchema.error.errors,
      });
    }
    const itemExists = await this.itensService.findItemById(Number(id));
    if (!itemExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Item not found',
      });
    }
    const item = await this.itensService.updateItem(Number(id), itemData);
    return {
      statusCode: 200,
      message: 'Item updated successfully',
      data: item,
    };
  }
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiResponse({
    status: 200,
    description: 'Item deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found.',
  })
  async deleteItem(@Param('id') id: string) {
    const itemExists = await this.itensService.findItemById(Number(id));
    if (!itemExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Item not found',
      });
    }
    await this.itensService.deleteItem(Number(id));
    return {
      statusCode: 200,
      message: 'Item deleted successfully',
    };
  }
}
