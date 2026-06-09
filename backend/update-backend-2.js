const fs = require('fs');
const base = 'd:/Hieudeptraivl/noithat-main/backend/src';

fs.writeFileSync(`${base}/categories/categories.controller.ts`, `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() data: any) { return this.categoriesService.create(data); }

  @Get()
  findAll() { return this.categoriesService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.categoriesService.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.categoriesService.update(+id, data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.categoriesService.remove(+id); }
}`);

fs.writeFileSync(`${base}/media/media.controller.ts`, `import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  create(@Body() data: any) { return this.mediaService.create(data); }

  @Get()
  findAll() { return this.mediaService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.mediaService.findOne(+id); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.mediaService.remove(+id); }
}`);
