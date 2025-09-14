import {
  Controller, Patch, Body, Req, UseGuards, Get,
  Param, ParseIntPipe, Post, Delete, Query,
  UploadedFile, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { checkAdmin } from '../common/rolecheck';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ListEmployeeDto } from './dto/list-employee.dto';
import { UpdateEmployeeSelfDto } from './dto/update-employee-self.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { ImageFileValidationPipe } from '../common/pipes/photo-validation.pipe';

@Controller('employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    checkAdmin(req.user.roleId);
    return this.employeeService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateEmployeeDto,    
    @Req() req: any,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    checkAdmin(req.user.roleId);
    return this.employeeService.create(dto, photo);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    checkAdmin(req.user.roleId);
    await this.employeeService.remove(id);
    return { message: 'Employee deleted' };
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllWithMeta(@Req() req: any, @Query() query: ListEmployeeDto) {
    checkAdmin(req.user.roleId);
    return this.employeeService.findAllWithMeta(query);
  }

  @Patch('self')
  @UseInterceptors(FileInterceptor('photo'))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateEmployeeSelfDto,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    return this.employeeService.updateSelf(req.id, dto, photo);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdateEmployeeAdminDto,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    checkAdmin(req.user.roleId);
    return this.employeeService.updateEmployee(id, dto, photo);
  }
}
