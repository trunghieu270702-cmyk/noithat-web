const fs = require('fs');
const path = require('path');

const base = 'd:/Hieudeptraivl/noithat-main/backend/src';

// 1. Categories
fs.writeFileSync(`${base}/categories/categories.module.ts`, `import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}`);

fs.writeFileSync(`${base}/categories/categories.service.ts`, `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  create(data: any) { return this.prisma.category.create({ data }); }
  findAll() { return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.category.findUnique({ where: { id } }); }
  update(id: number, data: any) { return this.prisma.category.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.category.delete({ where: { id } }); }
}`);

// 2. Media
fs.writeFileSync(`${base}/media/media.module.ts`, `import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}`);

fs.writeFileSync(`${base}/media/media.service.ts`, `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}
  create(data: any) { return this.prisma.media.create({ data }); }
  findAll() { return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.media.findUnique({ where: { id } }); }
  remove(id: number) { return this.prisma.media.delete({ where: { id } }); }
}`);

// 3. Operations
fs.writeFileSync(`${base}/operations/operations.module.ts`, `import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}`);

fs.writeFileSync(`${base}/operations/operations.service.ts`, `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}
  
  // Users
  findAllUsers() { return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } }); }
  createUser(data: any) { return this.prisma.user.create({ data }); }
  updateUser(id: number, data: any) { return this.prisma.user.update({ where: { id }, data }); }
  removeUser(id: number) { return this.prisma.user.delete({ where: { id } }); }

  // Logs
  findAllLogs() { return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } }); }
  createLog(data: any) { return this.prisma.auditLog.create({ data }); }
}`);

fs.writeFileSync(`${base}/operations/operations.controller.ts`, `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperationsService } from './operations.service';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('users')
  findAllUsers() { return this.operationsService.findAllUsers(); }

  @Post('users')
  createUser(@Body() data: any) { return this.operationsService.createUser(data); }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() data: any) { return this.operationsService.updateUser(+id, data); }

  @Delete('users/:id')
  removeUser(@Param('id') id: string) { return this.operationsService.removeUser(+id); }

  @Get('logs')
  findAllLogs() { return this.operationsService.findAllLogs(); }

  @Post('logs')
  createLog(@Body() data: any) { return this.operationsService.createLog(data); }
}`);

console.log("Backend services created.");
