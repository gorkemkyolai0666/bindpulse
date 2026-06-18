import { IsString, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class UpdateVolumeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsIn(['excellent', 'good', 'fair', 'poor', 'critical'])
  condition?: string;

  @IsOptional()
  @IsIn(['in_workshop', 'awaiting_materials', 'in_restoration', 'completed', 'returned'])
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  @IsString()
  projectId?: string;
}
