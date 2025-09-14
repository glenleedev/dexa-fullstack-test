import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeAdminDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  positionId?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  photo?: string;
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId: number;
}
