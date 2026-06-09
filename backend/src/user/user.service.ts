import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const admin = await this.prisma.user.findUnique({
      where: { username: 'admin' },
    });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await this.prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      this.logger.log(
        'Default admin account (admin/admin) created successfully.',
      );
    }
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(id: number, newPasswordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: newPasswordHash },
    });
  }
}
