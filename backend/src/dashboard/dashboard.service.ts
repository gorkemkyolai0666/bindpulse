import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(firmId: string) {
    const [
      totalProjects,
      activeProjects,
      totalVolumes,
      lowStockMaterials,
      upcomingAppointments,
      activeBenches,
    ] = await Promise.all([
      this.prisma.restorationProject.count({ where: { firmId } }),
      this.prisma.restorationProject.count({ where: { firmId, status: { in: ['intake', 'assessment', 'in_progress', 'awaiting_materials', 'quality_check'] } } }),
      this.prisma.volumeItem.count({ where: { firmId } }),
      this.prisma.materialStock.count({ where: { firmId, stockQty: { lte: 3 } } }),
      this.prisma.appointmentJob.count({ where: { firmId, status: 'scheduled' } }),
      this.prisma.workbench.count({ where: { firmId, status: { in: ['scheduled', 'active'] } } }),
    ]);

    return {
      totalProjects,
      activeProjects,
      totalVolumes,
      lowStockMaterials,
      upcomingAppointments,
      activeBenches,
    };
  }
}
