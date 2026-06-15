import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.article.create({ data: createDto });
  }

  findAll() {
    return this.prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.article.update({
      where: { id },
      data: updateDto,
    });
  }

  incrementView(id: number) {
    return this.prisma.article.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
