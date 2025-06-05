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
import { OrdersService } from './orders.service';
import { OrderSchema } from './dto.orders';
import { CreateOrderDto, UpdateOrderDto } from './DTO';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  async createOrder(@Body() orderData: CreateOrderDto) {
    try {
      const orderSchema = OrderSchema.safeParse(orderData);
      if (!orderSchema.success) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: orderSchema.error.errors,
        });
      }
      const order = await this.ordersService.createOrder(orderData);
      return {
        statusCode: 201,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          statusCode: 500,
          message: 'Internal server error',
        });
      }
    }
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Find orders by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Orders found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'No orders found for this user.',
  })
  async findOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders = await this.ordersService.findOrdersByUserId(
        Number(userId),
      );
      if (!orders || orders.length === 0) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'No orders found for this user',
        });
      }
      return {
        statusCode: 200,
        message: 'Orders found successfully',
        data: orders,
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
  @ApiOperation({ summary: 'Find order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async findOrderById(@Param('id') id: string) {
    try {
      const order = await this.ordersService.findOrderById(Number(id));
      if (!order) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Order not found',
        });
      }
      return {
        statusCode: 200,
        message: 'Order found successfully',
        data: order,
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
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async updateOrder(
    @Body() orderData: UpdateOrderDto,
    @Param('id') id: string,
  ) {
    try {
      const orderSchema = OrderSchema.safeParse(orderData);
      if (!orderSchema.success) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: orderSchema.error.errors,
        });
      }
      const orderExists = await this.ordersService.findOrderById(Number(id));
      if (!orderExists) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Order not found',
        });
      }
      const updatedOrder = await this.ordersService.updateOrder(
        Number(id),
        orderData,
      );
      return {
        statusCode: 200,
        message: 'Order updated successfully',
        data: updatedOrder,
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
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
  })
  async deleteOrder(@Param('id') id: string) {
    try {
      const orderExists = await this.ordersService.findOrderById(Number(id));
      if (!orderExists) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Order not found',
        });
      }
      await this.ordersService.deleteOrder(Number(id));
      return {
        statusCode: 200,
        message: 'Order deleted successfully',
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
}
