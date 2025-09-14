import { IsString, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @Type(() => Number)
  @IsInt()
  positionId: number;

  @IsString()
  password: string;

  @Type(() => Number)
  @IsInt()
  roleId: number;
}
