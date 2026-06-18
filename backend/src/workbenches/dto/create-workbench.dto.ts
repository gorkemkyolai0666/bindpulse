import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateWorkbenchDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  artisan: string;

  @IsString()
  scheduledAt: string;

  @IsInt()
  @Min(1)
  maxSlots: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  booked?: number;
}
