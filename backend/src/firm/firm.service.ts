import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Injectable()
export class FirmService {
  constructor(private readonly prisma: PrismaService) {}

  async get(firmId: string) {
    const firm = await this.prisma.firm.findUnique({ where: { id: firmId } });
    if (!firm) throw new NotFoundException('Firma bulunamadı');
    return firm;
  }

  async update(firmId: string, dto: UpdateFirmDto) {
    return this.prisma.firm.update({ where: { id: firmId }, data: dto });
  }
}
