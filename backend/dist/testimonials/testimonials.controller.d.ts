import { TestimonialsService } from './testimonials.service';
export declare class TestimonialsController {
    private readonly testimonialsService;
    constructor(testimonialsService: TestimonialsService);
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
    findOne(id: string): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
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
    update(id: string, updateDto: any): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
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
    remove(id: string): import("@prisma/client").Prisma.Prisma__TestimonialClient<{
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
