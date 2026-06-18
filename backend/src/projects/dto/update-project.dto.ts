import { IsString, IsOptional, IsInt, IsIn, Min } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectNumber?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsIn(['restoration', 'rebinding', 'gilding', 'conservation', 'custom_binding', 'repair'])
  projectType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  volumeCount?: number;

  @IsOptional()
  @IsIn(['intake', 'assessment', 'in_progress', 'awaiting_materials', 'quality_check', 'ready', 'delivered', 'quoted'])
  status?: string;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
