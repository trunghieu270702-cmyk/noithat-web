import { OperationsService } from './operations.service';
export declare class OperationsController {
    private readonly operationsService;
    constructor(operationsService: OperationsService);
    findAllUsers(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createUser(data: any): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateUser(id: string, data: any): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeUser(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAllLogs(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        username: string;
        createdAt: Date;
        userId: number | null;
        action: string;
        module: string;
    }[]>;
    createLog(data: any): import("@prisma/client").Prisma.Prisma__AuditLogClient<{
        id: number;
        username: string;
        createdAt: Date;
        userId: number | null;
        action: string;
        module: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
