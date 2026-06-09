import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SupervisionsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.supervision.create({ data: createDto });
  }

  findAll() {
    return this.prisma.supervision.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.supervision.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.supervision.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.supervision.delete({ where: { id } });
  }
}
