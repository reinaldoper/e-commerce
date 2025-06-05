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
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { OrderSchema } from './dto.orders';

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
  async createOrder(@Body() orderData: Prisma.OrderCreateInput) {
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
    const orders = await this.ordersService.findOrdersByUserId(Number(userId));
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
    @Body() orderData: Prisma.OrderUpdateInput,
    @Param('id') id: string,
  ) {
    const orderSchema = OrderSchema.safeParse(orderData);
    if (!orderSchema.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: orderSchema.error.errors,
      });
    }
    const order = await this.ordersService.updateOrder(Number(id), orderData);
    return {
      statusCode: 200,
      message: 'Order updated successfully',
      data: order,
    };
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
    const orderExists = await this.ordersService.findOrderById(Number(id));
    if (!orderExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Order not found',
      });
    }
    const order = await this.ordersService.deleteOrder(Number(id));
    return {
      statusCode: 200,
      message: 'Order deleted successfully',
      data: order,
    };
  }
}
