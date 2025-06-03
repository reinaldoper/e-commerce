import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
        ordersItem: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        ordersItem: true,
      },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return await this.prisma.product.create({
      data,
    });
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await this.prisma.product.findMany({
      where: { name: { contains: name } },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
        ordersItem: true,
      },
    });
  }
}
