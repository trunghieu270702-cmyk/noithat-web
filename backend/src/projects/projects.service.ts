import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.project.create({ data: createDto });
  }

  findAll() {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.project.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
