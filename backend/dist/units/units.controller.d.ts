import { UnitsService } from './units.service';
export declare class UnitsController {
    private readonly unitsService;
    constructor(unitsService: UnitsService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UnitClient<{
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
    update(id: string, updateDto: any): import("@prisma/client").Prisma.Prisma__UnitClient<{
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
    remove(id: string): import("@prisma/client").Prisma.Prisma__UnitClient<{
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
