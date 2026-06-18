import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(@Request() req: any, @Query('page') page?: string, @Query('status') status?: string) {
    return this.appointmentsService.findAll(req.user.firmId, { page: page ? +page : 1, status });
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.firmId, dto);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(req.user.firmId, id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.appointmentsService.remove(req.user.firmId, id);
  }
}
