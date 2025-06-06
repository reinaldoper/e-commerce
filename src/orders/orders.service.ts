import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './DTO';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(orderData: CreateOrderDto) {
    try {
      return this.prisma.order.create({
        data: orderData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(error.message);
      }
    }
  }

  async findOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        items: true,
      },
    });
  }

  async updateOrder(id: number, orderData: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: orderData,
    });
  }

  async deleteOrder(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async findAllOrders() {
    return await this.prisma.order.findMany({
      select: {
        id: true,
        userId: true,
        createdAt: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOrdersByUserId(userId: number) {
    return await this.prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        items: true,
      },
    });
  }
}
