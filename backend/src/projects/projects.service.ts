import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(firmId: string, params: { page: number; status?: string; clientName?: string }) {
    const take = 20;
    const skip = (params.page - 1) * take;
    const where: any = { firmId };
    if (params.status) where.status = params.status;
    if (params.clientName) where.clientName = { contains: params.clientName, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.restorationProject.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.restorationProject.count({ where }),
    ]);
    return { data, total, page: params.page, pageSize: take };
  }

  async create(firmId: string, dto: CreateProjectDto) {
    return this.prisma.restorationProject.create({ data: { ...dto, firmId } as any });
  }

  async update(firmId: string, id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.restorationProject.findFirst({ where: { id, firmId } });
    if (!project) throw new NotFoundException('Proje bulunamadı');
    return this.prisma.restorationProject.update({ where: { id }, data: dto as any });
  }

  async remove(firmId: string, id: string) {
    const project = await this.prisma.restorationProject.findFirst({ where: { id, firmId } });
    if (!project) throw new NotFoundException('Proje bulunamadı');
    await this.prisma.restorationProject.delete({ where: { id } });
    return { deleted: true };
  }
}
