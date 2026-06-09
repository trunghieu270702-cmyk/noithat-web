import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
}