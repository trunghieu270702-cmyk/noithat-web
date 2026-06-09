import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
}