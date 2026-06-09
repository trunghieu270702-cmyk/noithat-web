import { PrismaService } from '../prisma/prisma.service';
export declare class UnitsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__UnitClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        segment: string;
        location: string;
        projectType: string;
        style: string;
        experience: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        segment: string;
        location: string;
        projectType: string;
        style: string;
        experience: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__UnitClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        segment: string;
        location: string;
        projectType: string;
        style: string;
        experience: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__UnitClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        segment: string;
        location: string;
        projectType: string;
        style: string;
        experience: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UnitClient<{
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        segment: string;
        location: string;
        projectType: string;
        style: string;
        experience: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
