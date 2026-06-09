import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const totalUnits = await this.prisma.unit.count();
    const activeUnits = await this.prisma.unit.count({ where: { status: 'ACTIVE' } });
    const pendingUnits = await this.prisma.unit.count({ where: { status: 'PENDING' } });
    const hiddenUnits = await this.prisma.unit.count({ where: { status: 'HIDDEN' } });
    
    const totalLeads = await this.prisma.lead.count();
    const pendingLeads = await this.prisma.lead.count({ where: { status: 'NEW' } });
    const processingLeads = await this.prisma.lead.count({ where: { status: 'CONSULTING' } });
    
    // Just mock some time-based for now
    const leadsToday = await this.prisma.lead.count();
    const leadsThisWeek = await this.prisma.lead.count();
    const leadsThisMonth = await this.prisma.lead.count();

    const totalSupervisions = await this.prisma.supervision.count();
    const totalArticles = await this.prisma.article.count();
    const publishedArticles = await this.prisma.article.count({ where: { status: 'PUBLISHED' } });
    
    const indexedSeoPages = await this.prisma.seoPage.count();
    const processingProjects = await this.prisma.project.count({ where: { status: 'IN_PROGRESS' } });

    const recentLeads = await this.prisma.lead.findMany({ take: 10, orderBy: { createdAt: 'desc' } });

    // Chart Data
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
}
