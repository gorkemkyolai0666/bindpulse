import { IsString, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

export class CreateVolumeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsIn(['excellent', 'good', 'fair', 'poor', 'critical'])
  condition: string;

  @IsIn(['in_workshop', 'awaiting_materials', 'in_restoration', 'completed', 'returned'])
  status: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  @IsString()
  projectId?: string;
}
