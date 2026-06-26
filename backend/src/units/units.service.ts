import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueSlug(slug: string, id?: number): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.unit.findUnique({ where: { slug: uniqueSlug } });
      if (!existing || (id && existing.id === id)) {
        return uniqueSlug;
      }
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }

  async create(createDto: any) {
    if (createDto.slug) {
      createDto.slug = await this.generateUniqueSlug(createDto.slug);
    }
    const { categoryIds, categories, createdAt, updatedAt, id, ...data } = createDto;
    return this.prisma.unit.create({ 
      data: {
        ...data,
        categories: categoryIds && Array.isArray(categoryIds) ? { connect: categoryIds.map((id: number) => ({ id })) } : undefined
      },
      include: { categories: true }
    });
  }

  findAll() {
    return this.prisma.unit.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { categories: true }
    });
  }

  findOne(id: number) {
    return this.prisma.unit.findUnique({ 
      where: { id },
      include: { categories: true }
    });
  }

  async update(id: number, updateDto: any) {
    if (updateDto.slug) {
      updateDto.slug = await this.generateUniqueSlug(updateDto.slug, id);
    }
    const { categoryIds, categories, createdAt, updatedAt, id: unitId, ...data } = updateDto;
    return this.prisma.unit.update({
      where: { id },
      data: {
        ...data,
        categories: categoryIds && Array.isArray(categoryIds) ? { set: categoryIds.map((id: number) => ({ id })) } : undefined
      },
      include: { categories: true }
    });
  }

  remove(id: number) {
    return this.prisma.unit.delete({ where: { id } });
  }
}
