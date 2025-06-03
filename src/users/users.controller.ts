import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { UserSchema, UserLoginSchema } from './dto.users';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userData: Prisma.UserCreateInput) {
    const userSchema = UserSchema.safeParse(userData);
    if (!userSchema.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: userSchema.error.errors,
      });
    }
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException({
        statusCode: 409,
        message: 'User with this email already exists',
      });
    }
    const user = await this.usersService.create(userData);
    return {
      statusCode: 201,
      message: 'User registered successfully',
      data: user,
    };
  }

  @Put('update/:id')
  async updateUser(
    @Body() userData: Prisma.UserUpdateInput,
    @Param('id') id: string,
  ) {
    const userSchema = UserSchema.safeParse(userData);
    if (!userSchema.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: userSchema.error.errors,
      });
    }
    const userExists = await this.usersService.findOne(Number(id));
    if (!userExists) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    const user = await this.usersService.update(Number(id), userData);
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() loginData: Prisma.UserCreateInput) {
    const loginSchema = UserLoginSchema.safeParse(loginData);
    if (!loginSchema.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: loginSchema.error.errors,
      });
    }
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user || !(await bcrypt.compare(loginData.password, user.password))) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid email or password',
      });
    }
    return {
      statusCode: 200,
      message: 'Login successful',
      data: user,
    };
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    return {
      statusCode: 200,
      message: 'User found successfully',
      data: user,
    };
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAllUsers() {
    const users = await this.usersService.findAll();
    return {
      statusCode: 200,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    await this.usersService.delete(Number(id));
    return {
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }
}
