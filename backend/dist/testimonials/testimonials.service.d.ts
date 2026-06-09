import { PrismaService } from '../prisma/prisma.service';
export declare class TestimonialsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: any): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
        project: string | null;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        content: string | null;
        avatar: string | null;
        rating: number;
        featured: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        project: string | null;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        content: string | null;
        avatar: string | null;
        rating: number;
        featured: boolean;
    }[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
        project: string | null;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        content: string | null;
        avatar: string | null;
        rating: number;
        featured: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateDto: any): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
        project: string | null;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        content: string | null;
        avatar: string | null;
        rating: number;
        featured: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
        project: string | null;
        id: number;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        customerName: string;
        content: string | null;
        avatar: string | null;
        rating: number;
        featured: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
