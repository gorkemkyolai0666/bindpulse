import { IsString, IsOptional, IsInt, IsIn, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  projectNumber: string;

  @IsString()
  clientName: string;

  @IsIn(['restoration', 'rebinding', 'gilding', 'conservation', 'custom_binding', 'repair'])
  projectType: string;

  @IsInt()
  @Min(1)
  volumeCount: number;

  @IsOptional()
  @IsString()
  benchName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
