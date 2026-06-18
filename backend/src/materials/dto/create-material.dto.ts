import { IsString, IsNumber, IsIn, Min, IsOptional, IsInt } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  title: string;

  @IsIn(['leather', 'paper', 'thread', 'adhesive', 'gold_leaf', 'cloth', 'board', 'tool', 'chemical'])
  materialCategory: string;

  @IsNumber()
  @Min(0)
  pricePerUnit: number;

  @IsInt()
  @Min(0)
  stockQty: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  leadDays?: number;
}
