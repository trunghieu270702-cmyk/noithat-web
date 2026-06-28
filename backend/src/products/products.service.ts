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

  async findAll(query?: any) {
    const { take, skip, categoryId, excludeId, projectType, unitName, budget, isPinned } = query || {};
    
    let where: any = {};
    
    if (categoryId) {
      where.categories = { some: { id: parseInt(categoryId) } };
    }
    
    if (excludeId) {
      where.id = { not: parseInt(excludeId) };
    }
    
    if (isPinned === 'true') {
      where.isPinned = true;
    }
    
    // For products page filters
    if (projectType && projectType !== '*') {
      where.categories = where.categories || {};
      where.categories.some = {
        ...where.categories.some,
        name: projectType
      };
    }
    
    if (unitName && unitName !== '*') {
      where.unit = { name: unitName };
    }
    
    if (budget && budget !== '*') {
      // This is a simple exact match fallback, 
      // a proper implementation would need range parsing for budget.
      // E.g. "Dưới 1 tỷ" -> price < 1000000000
    }

    return this.prisma.product.findMany({
      where,
      take: take ? parseInt(take) : undefined,
      skip: skip ? parseInt(skip) : undefined,
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
