import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ListEmployeeDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit?: number;
}
