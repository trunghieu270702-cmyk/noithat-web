import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupervisionsService } from './supervisions.service';

@Controller('supervisions')
export class SupervisionsController {
  constructor(private readonly supervisionsService: SupervisionsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.supervisionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.supervisionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supervisionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.supervisionsService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supervisionsService.remove(+id);
  }
}
