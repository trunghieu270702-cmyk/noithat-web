import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.lead.create({ data: createDto });
  }

  findAll() {
    return this.prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.lead.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.lead.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.lead.delete({ where: { id } });
  }
}
