import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItensService {
  constructor(private readonly prisma: PrismaService) {}
  async createItem(itemData: Prisma.OrderItemCreateInput) {
    return await this.prisma.orderItem.create({
      data: itemData,
    });
  }
  async findItemById(id: number) {
    return await this.prisma.orderItem.findUnique({
      where: { id },
      select: {
        orderId: true,
        productId: true,
        quantity: true,
        price: true,
      },
    });
  }
  async updateItem(id: number, itemData: Prisma.OrderItemUpdateInput) {
    return await this.prisma.orderItem.update({
      where: { id },
      data: itemData,
    });
  }
  async deleteItem(id: number) {
    return await this.prisma.orderItem.delete({
      where: { id },
    });
  }
  async findAllItems() {
    return await this.prisma.orderItem.findMany({
      select: {
        orderId: true,
        productId: true,
        quantity: true,
        price: true,
      },
      orderBy: {
        quantity: 'desc',
      },
    });
  }
  async findItemsByOrderId(orderId: number) {
    return await this.prisma.orderItem.findMany({
      where: { orderId },
      select: {
        orderId: true,
        productId: true,
        quantity: true,
        price: true,
      },
    });
  }
  async findItemsByProductId(productId: number) {
    return await this.prisma.orderItem.findMany({
      where: { productId },
      select: {
        orderId: true,
        productId: true,
        quantity: true,
        price: true,
      },
    });
  }
}
