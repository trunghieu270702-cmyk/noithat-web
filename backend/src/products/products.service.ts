import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueSlug(slug: string, id?: number): Promise<string> {
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await this.prisma.product.findUnique({ where: { slug: uniqueSlug } });
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
    const { categoryIds, unit, categories, createdAt, updatedAt, id, ...productData } = data;
    return this.prisma.product.create({
      data: {
        ...productData,
        categories: categoryIds?.length > 0 ? {
          connect: categoryIds.map((cid: number) => ({ id: cid }))
        } : undefined
      },
      include: {
        categories: true,
        unit: true
      }
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        unit: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        unit: true
      }
    });
  }

  async update(id: number, data: any) {
    if (data.slug) {
      data.slug = await this.generateUniqueSlug(data.slug, id);
    }
    const { categoryIds, unit, categories, createdAt, updatedAt, id: productId, ...productData } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categories: categoryIds ? {
          set: categoryIds.map((cid: number) => ({ id: cid }))
        } : undefined
      },
      include: {
        categories: true,
        unit: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id }
    });
  }
}
