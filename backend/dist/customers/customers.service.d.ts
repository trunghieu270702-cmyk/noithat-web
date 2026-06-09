import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
