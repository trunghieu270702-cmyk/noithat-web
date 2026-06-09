import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
