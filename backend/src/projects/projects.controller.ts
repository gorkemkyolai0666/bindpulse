import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Request() req: any, @Query('page') page?: string, @Query('status') status?: string, @Query('clientName') clientName?: string) {
    return this.projectsService.findAll(req.user.firmId, { page: page ? +page : 1, status, clientName });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.projectsService.remove(req.user.firmId, id);
  }
}
