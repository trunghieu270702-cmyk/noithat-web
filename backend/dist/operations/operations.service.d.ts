import { PrismaService } from '../prisma/prisma.service';
export declare class OperationsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateUser(id: number, data: any): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        username: string;
        password: string;
        role: string;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    removeUser(id: number): import("@prisma/client").Prisma.Prisma__UserClient<{
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
