import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(orderData: Prisma.OrderCreateInput) {
    return this.prisma.order.create({
      data: orderData,
    });
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

  async updateOrder(id: number, orderData: Prisma.OrderUpdateInput) {
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
