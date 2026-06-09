import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.testimonial.create({ data: createDto });
  }

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.testimonial.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.testimonial.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
