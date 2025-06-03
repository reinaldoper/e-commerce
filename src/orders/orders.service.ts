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
    return this.prisma.order.findMany();
  }

  async findOrdersByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }
}
