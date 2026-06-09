import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__CategoryClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        type: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
