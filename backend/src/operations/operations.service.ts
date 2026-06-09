import { Injectable } from '@nestjs/common';
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
}