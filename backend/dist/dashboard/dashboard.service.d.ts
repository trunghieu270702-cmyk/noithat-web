import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        stats: {
            totalUnits: number;
            activeUnits: number;
            pendingUnits: number;
            hiddenUnits: number;
            totalLeads: number;
            pendingLeads: number;
            processingLeads: number;
            leadsToday: number;
            leadsThisWeek: number;
            leadsThisMonth: number;
            conversionRate: string;
            totalSupervisions: number;
            totalArticles: number;
            publishedArticles: number;
            indexedSeoPages: number;
            processingProjects: number;
        };
        recentLeads: {
            id: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            location: string;
            projectType: string | null;
            style: string | null;
            customerName: string;
            phone: string;
            email: string | null;
            source: string | null;
            assignee: string | null;
            area: number | null;
            projectLocation: string | null;
            currentStatus: string | null;
            budget: string | null;
            timeline: string | null;
            priority: string | null;
            needs: string | null;
            needSupervision: boolean;
            needProjectManagement: boolean;
            notes: string | null;
            leadClassification: string | null;
            proposedUnits: string | null;
            connectedUnit: string | null;
            callNotes: string | null;
            chatNotes: string | null;
            followUpDate: string | null;
        }[];
        chartData: {
            date: string;
            leads: number;
            supervisions: number;
        }[];
    }>;
}
