import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Controller('materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(@Request() req: any, @Query('page') page?: string, @Query('category') category?: string) {
    return this.materialsService.findAll(req.user.firmId, { page: page ? +page : 1, category });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateMaterialDto) {
    return this.materialsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.materialsService.remove(req.user.firmId, id);
  }
}
