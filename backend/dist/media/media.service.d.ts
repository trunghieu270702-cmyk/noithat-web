import { PrismaService } from '../prisma/prisma.service';
export declare class MediaService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import("@prisma/client").Prisma.Prisma__MediaClient<{
        id: number;
        createdAt: Date;
        name: string;
        type: string;
        url: string;
        size: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        name: string;
        type: string;
        url: string;
        size: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__MediaClient<{
        id: number;
        createdAt: Date;
        name: string;
        type: string;
        url: string;
        size: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__MediaClient<{
        id: number;
        createdAt: Date;
        name: string;
        type: string;
        url: string;
        size: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
