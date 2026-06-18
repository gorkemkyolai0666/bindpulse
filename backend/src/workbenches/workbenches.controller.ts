import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkbenchesService } from './workbenches.service';
import { CreateWorkbenchDto } from './dto/create-workbench.dto';
import { UpdateWorkbenchDto } from './dto/update-workbench.dto';

@Controller('workbenches')
@UseGuards(JwtAuthGuard)
export class WorkbenchesController {
  constructor(private readonly workbenchesService: WorkbenchesService) {}

  @Get()
  findAll(@Request() req: any, @Query('page') page?: string, @Query('status') status?: string) {
    return this.workbenchesService.findAll(req.user.firmId, { page: page ? +page : 1, status });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateWorkbenchDto) {
    return this.workbenchesService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateWorkbenchDto) {
    return this.workbenchesService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.workbenchesService.remove(req.user.firmId, id);
  }
}
