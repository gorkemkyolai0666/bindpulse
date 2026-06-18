import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(firmId: string, params: { page: number; status?: string }) {
    const take = 20;
    const skip = (params.page - 1) * take;
    const where: any = { firmId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.appointmentJob.findMany({ where, take, skip, orderBy: { scheduledAt: 'asc' } }),
      this.prisma.appointmentJob.count({ where }),
    ]);
    return { data, total, page: params.page, pageSize: take };
  }

  async create(firmId: string, dto: CreateAppointmentDto) {
    return this.prisma.appointmentJob.create({ data: { ...dto, scheduledAt: new Date(dto.scheduledAt), firmId } });
  }

  async update(firmId: string, id: string, dto: UpdateAppointmentDto) {
    const item = await this.prisma.appointmentJob.findFirst({ where: { id, firmId } });
    if (!item) throw new NotFoundException('Randevu bulunamadı');
    const data: any = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    return this.prisma.appointmentJob.update({ where: { id }, data });
  }

  async remove(firmId: string, id: string) {
    const item = await this.prisma.appointmentJob.findFirst({ where: { id, firmId } });
    if (!item) throw new NotFoundException('Randevu bulunamadı');
    await this.prisma.appointmentJob.delete({ where: { id } });
    return { deleted: true };
  }
}
