import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    console.log('[DEBUG] seedAdmin started');
    const hashedPassword = await bcrypt.hash('123456', 10);
    console.log('[DEBUG] bcrypt.hash completed');
    const admin = await this.prisma.user.findUnique({
      where: { username: 'admin' },
    });
    console.log('[DEBUG] prisma.user.findUnique completed');
    if (!admin) {
      await this.prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });
      this.logger.log(
        'Default admin account (admin/123456) created successfully.',
      );
    } else {
      await this.prisma.user.update({
        where: { username: 'admin' },
        data: { password: hashedPassword },
      });
      this.logger.log(
        'Default admin account (admin) password updated to 123456.',
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
