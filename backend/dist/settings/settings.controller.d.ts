import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateDto: any): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__SettingClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
