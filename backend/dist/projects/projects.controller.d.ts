import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ProjectClient<{
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
    update(id: string, updateDto: any): import("@prisma/client").Prisma.Prisma__ProjectClient<{
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
    remove(id: string): import("@prisma/client").Prisma.Prisma__ProjectClient<{
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
