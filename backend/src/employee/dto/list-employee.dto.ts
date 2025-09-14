import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListEmployeeDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
