import { IsString, IsNumber, IsIn, Min, IsOptional, IsInt } from 'class-validator';

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(['leather', 'paper', 'thread', 'adhesive', 'gold_leaf', 'cloth', 'board', 'tool', 'chemical'])
  materialCategory?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerUnit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQty?: number;

  @IsOptional()
  @IsIn(['active', 'low_stock', 'discontinued'])
  status?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  leadDays?: number;
}
