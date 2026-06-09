import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService implements OnModuleInit {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    seedAdmin(): Promise<void>;
    findByUsername(username: string): Promise<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: number): Promise<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updatePassword(id: number, newPasswordHash: string): Promise<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
