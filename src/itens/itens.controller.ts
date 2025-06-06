import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItensService } from './itens.service';
import { ItemSchema } from './dto.itens';
import { CreateItemDto, UpdateItemDto } from './DTO';

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
  async createItem(@Body() itemData: CreateItemDto) {
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      } else if (error instanceof BadRequestException) {
        throw error;
      }
    }
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
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
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
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
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
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format.',
  })
  async findItemById(@Param('id') id: string) {
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid ID format',
      });
    }
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
  async updateItem(@Body() itemData: UpdateItemDto, @Param('id') id: string) {
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
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
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format.',
  })
  async deleteItem(@Param('id') id: string) {
    try {
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
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid ID format',
      });
    }
  }
}
