import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeoPagesService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.seoPage.create({ data: createDto });
  }

  findAll() {
    return this.prisma.seoPage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.seoPage.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.seoPage.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.seoPage.delete({ where: { id } });
  }
}
