import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeSelfDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
