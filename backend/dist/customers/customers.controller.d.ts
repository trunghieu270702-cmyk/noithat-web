import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, updateDto: any): import("@prisma/client").Prisma.Prisma__CustomerClient<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        fullName: string;
        phoneNumber: string;
        address: string | null;
        totalLeads: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__CustomerClient<{
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
