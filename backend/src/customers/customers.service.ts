import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.customer.create({ data: createDto });
  }

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.customer.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
