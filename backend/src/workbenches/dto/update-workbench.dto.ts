import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class UpdateWorkbenchDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  artisan?: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxSlots?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  booked?: number;

  @IsOptional()
  @IsIn(['scheduled', 'active', 'completed', 'cancelled'])
  status?: string;
}
