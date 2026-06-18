import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(firmId: string, params: { page: number; category?: string }) {
    const take = 20;
    const skip = (params.page - 1) * take;
    const where: any = { firmId };
    if (params.category) where.materialCategory = params.category;

    const [data, total] = await Promise.all([
      this.prisma.materialStock.findMany({ where, take, skip, orderBy: { title: 'asc' } }),
      this.prisma.materialStock.count({ where }),
    ]);
    return { data, total, page: params.page, pageSize: take };
  }

  async create(firmId: string, dto: CreateMaterialDto) {
    return this.prisma.materialStock.create({ data: { ...dto, firmId } as any });
  }

  async update(firmId: string, id: string, dto: UpdateMaterialDto) {
    const material = await this.prisma.materialStock.findFirst({ where: { id, firmId } });
    if (!material) throw new NotFoundException('Malzeme bulunamadı');
    return this.prisma.materialStock.update({ where: { id }, data: dto as any });
  }

  async remove(firmId: string, id: string) {
    const material = await this.prisma.materialStock.findFirst({ where: { id, firmId } });
    if (!material) throw new NotFoundException('Malzeme bulunamadı');
    await this.prisma.materialStock.delete({ where: { id } });
    return { deleted: true };
  }
}
