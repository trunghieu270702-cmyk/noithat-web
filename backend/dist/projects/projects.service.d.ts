import { PrismaService } from '../prisma/prisma.service';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectType: string | null;
        area: number | null;
        budget: string | null;
        unitId: number | null;
        unitName: string | null;
        startDate: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectType: string | null;
        area: number | null;
        budget: string | null;
        unitId: number | null;
        unitName: string | null;
        startDate: string | null;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectType: string | null;
        area: number | null;
        budget: string | null;
        unitId: number | null;
        unitName: string | null;
        startDate: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectType: string | null;
        area: number | null;
        budget: string | null;
        unitId: number | null;
        unitName: string | null;
        startDate: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        projectType: string | null;
        area: number | null;
        budget: string | null;
        unitId: number | null;
        unitName: string | null;
        startDate: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
