import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkbenchDto } from './dto/create-workbench.dto';
import { UpdateWorkbenchDto } from './dto/update-workbench.dto';

@Injectable()
export class WorkbenchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(firmId: string, params: { page: number; status?: string }) {
    const take = 20;
    const skip = (params.page - 1) * take;
    const where: any = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.workbench.findMany({ where, take, skip, orderBy: { scheduledAt: 'asc' } }),
      this.prisma.workbench.count({ where }),
    ]);
    return { data, total, page: params.page, pageSize: take };
  }

  async create(firmId: string, dto: CreateWorkbenchDto) {
    return this.prisma.workbench.create({ data: { ...dto, scheduledAt: new Date(dto.scheduledAt), firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateWorkbenchDto) {
    const item = await this.prisma.workbench.findFirst({ where: { id, firmId } });
    if (!item) throw new NotFoundException('Tezgah bulunamadı');
    const data: any = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.workbench.update({ where: { id }, data });
  }

  async remove(firmId: string, id: string) {
    const item = await this.prisma.workbench.findFirst({ where: { id, firmId } });
    if (!item) throw new NotFoundException('Tezgah bulunamadı');
    await this.prisma.workbench.delete({ where: { id } });
    return { deleted: true };
  }
}
