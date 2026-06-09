import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.setting.create({ data: createDto });
  }

  findAll() {
    return this.prisma.setting.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.setting.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.setting.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.setting.delete({ where: { id } });
  }
}
