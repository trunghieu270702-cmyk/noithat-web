import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  create(data: any) { return this.prisma.category.create({ data }); }
  findAll() { return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.category.findUnique({ where: { id } }); }
  update(id: number, data: any) { return this.prisma.category.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.category.delete({ where: { id } }); }
}