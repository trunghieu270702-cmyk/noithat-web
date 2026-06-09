import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}
  create(data: any) { return this.prisma.media.create({ data }); }
  findAll() { return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } }); }
  findOne(id: number) { return this.prisma.media.findUnique({ where: { id } }); }
  remove(id: number) { return this.prisma.media.delete({ where: { id } }); }
}