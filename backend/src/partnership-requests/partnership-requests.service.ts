import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnershipRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.partnershipRequest.create({
      data: {
        companyName: data.companyName,
        contactName: data.contactName,
        phone: data.phone,
        email: data.email,
        location: data.location,
        experience: data.experience,
        portfolioUrl: data.portfolioUrl,
        notes: data.notes,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.partnershipRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const req = await this.prisma.partnershipRequest.findUnique({
      where: { id },
    });
    if (!req) throw new NotFoundException('Yêu cầu không tồn tại');
    return req;
  }

  async approve(id: number) {
    const req = await this.findOne(id);
    if (req.status !== 'PENDING') {
      throw new Error('Yêu cầu đã được xử lý trước đó');
    }

    // Cập nhật trạng thái
    const updatedReq = await this.prisma.partnershipRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    // Tạo slug từ companyName
    const slug = req.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    // Tạo Unit tương ứng (ACTIVE)
    const newUnit = await this.prisma.unit.create({
      data: {
        name: req.companyName,
        slug: slug,
        segment: 'Chưa phân loại',
        location: req.location,
        projectType: 'Đối tác',
        style: 'Khác',
        experience: parseInt(req.experience) || 0,
        status: 'ACTIVE',
        phone: req.phone,
        email: req.email,
        profile: req.portfolioUrl,
        shortDescription: req.notes,
        isVisible: true,
      },
    });

    return { request: updatedReq, unit: newUnit };
  }

  async reject(id: number) {
    const req = await this.findOne(id);
    if (req.status !== 'PENDING') {
      throw new Error('Yêu cầu đã được xử lý trước đó');
    }

    return this.prisma.partnershipRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async remove(id: number) {
    return this.prisma.partnershipRequest.delete({
      where: { id },
    });
  }
}
