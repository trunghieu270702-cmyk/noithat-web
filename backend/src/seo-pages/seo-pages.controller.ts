import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeoPagesService } from './seo-pages.service';

@Controller('seopages')
export class SeoPagesController {
  constructor(private readonly seopagesService: SeoPagesService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.seopagesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.seopagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seopagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.seopagesService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seopagesService.remove(+id);
  }
}
