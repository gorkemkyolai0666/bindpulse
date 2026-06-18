import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FirmService } from './firm.service';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Controller('firm')
@UseGuards(JwtAuthGuard)
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get()
  get(@Request() req: any) {
    return this.firmService.get(req.user.firmId);
  }

  @Patch()
  update(@Request() req: any, @Body() dto: UpdateFirmDto) {
    return this.firmService.update(req.user.firmId, dto);
  }
}
