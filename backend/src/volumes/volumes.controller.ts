import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VolumesService } from './volumes.service';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';

@Controller('volumes')
@UseGuards(JwtAuthGuard)
export class VolumesController {
  constructor(private readonly volumesService: VolumesService) {}

  @Get()
  findAll(@Request() req: any, @Query('page') page?: string, @Query('condition') condition?: string) {
    return this.volumesService.findAll(req.user.firmId, { page: page ? +page : 1, condition });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateVolumeDto) {
    return this.volumesService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateVolumeDto) {
    return this.volumesService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.volumesService.remove(req.user.firmId, id);
  }
}
