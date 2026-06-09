"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary() {
        const totalUnits = await this.prisma.unit.count();
        const activeUnits = await this.prisma.unit.count({ where: { status: 'ACTIVE' } });
        const pendingUnits = await this.prisma.unit.count({ where: { status: 'PENDING' } });
        const hiddenUnits = await this.prisma.unit.count({ where: { status: 'HIDDEN' } });
        const totalLeads = await this.prisma.lead.count();
        const pendingLeads = await this.prisma.lead.count({ where: { status: 'NEW' } });
        const processingLeads = await this.prisma.lead.count({ where: { status: 'CONSULTING' } });
        const leadsToday = await this.prisma.lead.count();
        const leadsThisWeek = await this.prisma.lead.count();
        const leadsThisMonth = await this.prisma.lead.count();
        const totalSupervisions = await this.prisma.supervision.count();
        const totalArticles = await this.prisma.article.count();
        const publishedArticles = await this.prisma.article.count({ where: { status: 'PUBLISHED' } });
        const indexedSeoPages = await this.prisma.seoPage.count();
        const processingProjects = await this.prisma.project.count({ where: { status: 'IN_PROGRESS' } });
        const recentLeads = await this.prisma.lead.findMany({ take: 10, orderBy: { createdAt: 'desc' } });
        const chartData = [
            { date: '01/06', leads: 5, supervisions: 1 },
            { date: '02/06', leads: 8, supervisions: 0 },
            { date: '03/06', leads: 12, supervisions: 2 },
            { date: '04/06', leads: 7, supervisions: 1 },
            { date: '05/06', leads: 15, supervisions: 3 },
            { date: '06/06', leads: 10, supervisions: 0 },
            { date: '07/06', leads: 22, supervisions: 4 },
        ];
        return {
            stats: {
                totalUnits, activeUnits, pendingUnits, hiddenUnits,
                totalLeads, pendingLeads, processingLeads,
                leadsToday, leadsThisWeek, leadsThisMonth,
                conversionRate: '15.5%',
                totalSupervisions, totalArticles, publishedArticles,
                indexedSeoPages, processingProjects
            },
            recentLeads,
            chartData
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map