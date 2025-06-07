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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Prisma } from '@prisma/client';
import { ProductSchema } from './dto.products';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
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
  @ApiOperation({ summary: 'Atualiza um produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
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
  @ApiOperation({ summary: 'Encontra um produto pelo ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  async findProduct(@Param('id') id: string) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid user ID',
      });
    }
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
  @ApiOperation({ summary: 'Encontra todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Produtos encontrados com sucesso.',
  })
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
  @ApiOperation({ summary: 'Encontra produtos pelo titulo' })
  @ApiResponse({
    status: 200,
    description: 'Produtos encontrados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Nenhum produto encontrado.' })
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
  @ApiOperation({ summary: 'Deleta um produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  async deleteProduct(@Param('id') id: string) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid product ID',
      });
    }
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
