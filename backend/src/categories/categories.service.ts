import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueSlug(slug: string, id?: number): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.category.findUnique({ where: { slug: uniqueSlug } });
      if (!existing || (id && existing.id === id)) {
        return uniqueSlug;
      }
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
  }

  async create(data: any) {
    if (data.slug) {
      data.slug = await this.generateUniqueSlug(data.slug);
    }
    const { children, level, createdAt, updatedAt, ...cleanData } = data;
    return this.prisma.category.create({ data: cleanData });
  }

  findAll() { return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.category.findUnique({ where: { id } }); }

  async update(id: number, data: any) {
    if (data.slug) {
      data.slug = await this.generateUniqueSlug(data.slug, id);
    }
    const { children, level, createdAt, updatedAt, id: categoryId, ...cleanData } = data;
    return this.prisma.category.update({ where: { id }, data: cleanData });
  }

  remove(id: number) { return this.prisma.category.delete({ where: { id } }); }
}