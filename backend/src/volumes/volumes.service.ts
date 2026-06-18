import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';

@Injectable()
export class VolumesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(firmId: string, params: { page: number; condition?: string }) {
    const take = 20;
    const skip = (params.page - 1) * take;
    const where: any = { firmId };
    if (params.condition) where.condition = params.condition;

    const [data, total] = await Promise.all([
      this.prisma.volumeItem.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      this.prisma.volumeItem.count({ where }),
    ]);
    return { data, total, page: params.page, pageSize: take };
  }

  async create(firmId: string, dto: CreateVolumeDto) {
    return this.prisma.volumeItem.create({ data: { ...dto, firmId } as any });
  }

  async update(firmId: string, id: string, dto: UpdateVolumeDto) {
    const volume = await this.prisma.volumeItem.findFirst({ where: { id, firmId } });
    if (!volume) throw new NotFoundException('Cilt bulunamadı');
    return this.prisma.volumeItem.update({ where: { id }, data: dto as any });
  }

  async remove(firmId: string, id: string) {
    const volume = await this.prisma.volumeItem.findFirst({ where: { id, firmId } });
    if (!volume) throw new NotFoundException('Cilt bulunamadı');
    await this.prisma.volumeItem.delete({ where: { id } });
    return { deleted: true };
  }
}
