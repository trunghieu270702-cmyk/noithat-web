import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.unit.create({ data: createDto });
  }

  findAll() {
    return this.prisma.unit.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.unit.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.unit.delete({ where: { id } });
  }
}
