import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  appointmentName?: string;

  @IsOptional()
  @IsIn(['pickup', 'delivery', 'consultation', 'assessment', 'corporate'])
  appointmentType?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsIn(['scheduled', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  volumeCount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
