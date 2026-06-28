import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PartnershipRequestsService } from './partnership-requests.service';

@Controller('partnership-requests')
export class PartnershipRequestsController {
  constructor(private readonly partnershipRequestsService: PartnershipRequestsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.partnershipRequestsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.partnershipRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnershipRequestsService.findOne(+id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.partnershipRequestsService.approve(+id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.partnershipRequestsService.reject(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnershipRequestsService.remove(+id);
  }
}
