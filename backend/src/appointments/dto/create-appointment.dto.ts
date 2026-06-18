import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  appointmentName: string;

  @IsIn(['pickup', 'delivery', 'consultation', 'assessment', 'corporate'])
  appointmentType: string;

  @IsString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  volumeCount?: number;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
