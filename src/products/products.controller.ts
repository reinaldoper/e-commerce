import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { ProductSchema } from './dto.products';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() productData: Prisma.ProductCreateInput) {
    const parseProductData = ProductSchema.safeParse(productData);
    if (!parseProductData.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: parseProductData.error.errors,
      });
    }
    const product = await this.productsService.create(productData);
    return {
      statusCode: 201,
      message: 'Product created successfully',
      data: product,
    };
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Body() productData: Prisma.ProductUpdateInput,
    @Param('id') id: string,
  ) {
    const parseProductData = ProductSchema.safeParse(productData);
    if (!parseProductData.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: parseProductData.error.errors,
      });
    }
    const productExists = await this.productsService.findOne(Number(id));
    if (!productExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found',
      });
    }
    const product = await this.productsService.update(Number(id), productData);
    return {
      statusCode: 200,
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  async findProduct(@Param('id') id: string) {
    const product = await this.productsService.findOne(Number(id));
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found',
      });
    }
    return {
      statusCode: 200,
      message: 'Product found successfully',
      data: product,
    };
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAllProducts() {
    const products = await this.productsService.findAll();
    return {
      statusCode: 200,
      message: 'Products found successfully',
      data: products,
    };
  }
  @Get('search/:title')
  @HttpCode(HttpStatus.OK)
  async findProductsByName(@Param('title') title: string) {
    const products = await this.productsService.findByName(title);
    return {
      statusCode: 200,
      message: 'Products found successfully',
      data: products,
    };
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    const productExists = await this.productsService.findOne(Number(id));
    if (!productExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Product not found',
      });
    }
    const product = await this.productsService.delete(Number(id));
    return {
      statusCode: 200,
      message: 'Product deleted successfully',
      data: product,
    };
  }
}
