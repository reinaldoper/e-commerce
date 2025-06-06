import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './DTO';

@Injectable()
export class ItensService {
  constructor(private readonly prisma: PrismaService) {}
  async createItem(itemData: CreateItemDto) {
    try {
      const existingItem = await this.prisma.order.findFirst({
        where: {
          id: itemData.orderId,
        },
      });
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          id: itemData.productId,
        },
      });
      if (!existingItem || !existingProduct) {
        throw new InternalServerErrorException(
          `Order with ID ${itemData.orderId} or Product with ID ${itemData.productId} does not exist.`,
        );
      } else {
        const item = await this.prisma.orderItem.create({
          data: itemData,
        });
        return item;
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Internal server error occurred while creating item.',
        );
      } else if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }
  async findItemById(id: number) {
    try {
      const item = await this.prisma.orderItem.findUnique({
        where: { id },
        select: {
          orderId: true,
          productId: true,
          quantity: true,
          price: true,
        },
      });
      if (item === null) {
        throw new NotFoundException(`Item with ID ${id} not found.`);
      } else {
        return item;
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
  async updateItem(id: number, itemData: UpdateItemDto) {
    try {
      const existingItem = await this.prisma.order.findFirst({
        where: {
          id: itemData.orderId,
        },
      });
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          id: itemData.productId,
        },
      });
      if (!existingItem || !existingProduct) {
        throw new InternalServerErrorException(
          `Order with ID ${itemData.orderId} or Product with ID ${itemData.productId} does not exist.`,
        );
      }
      return await this.prisma.orderItem.update({
        where: { id },
        data: itemData,
      });
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Internal server error occurred while creating item.',
        );
      } else if (error instanceof BadRequestException) {
        throw error;
      }
    }
  }
  async deleteItem(id: number) {
    try {
      return await this.prisma.orderItem.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(
          'Internal server error occurred while creating item.',
        );
      } else if (error instanceof BadRequestException) {
        throw error;
      }
    }
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
