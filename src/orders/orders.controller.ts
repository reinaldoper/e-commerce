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
import { OrdersService } from './orders.service';
import { Prisma } from '@prisma/client';
import { OrderSchema } from './dto.orders';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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
