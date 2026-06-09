import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: any): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
