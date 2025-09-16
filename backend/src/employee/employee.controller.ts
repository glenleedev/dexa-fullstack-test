import {
  Controller, Patch, Body, Req, UseGuards, Get,
  Param, ParseIntPipe, Post, Delete, Query,
  UploadedFile, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { ListEmployeeDto } from './dto/list-employee.dto';
import { UpdateEmployeeSelfDto } from './dto/update-employee-self.dto';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { ImageFileValidationPipe } from '../common/pipes/photo-validation.pipe';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }
  @UseGuards(JwtAuthGuard)
  @Get('self')
  async findByIdSelf(@Req() req: any) {
    return this.employeeService.findById(req.user.employeeId);
  }

  @UseGuards(AdminAuthGuard)
  @Get('master/position')
  async findMasterPosition(@Req() req: any) {
    return this.employeeService.findMasterPosition();
  }

  @UseGuards(AdminAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.employeeService.findById(id);
  }

  @UseGuards(AdminAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateEmployeeDto,
    @Req() req: any,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    return this.employeeService.create(dto, photo);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.employeeService.remove(id);
    return { message: 'Employee deleted' };
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllWithMeta(@Req() req: any, @Query() query: ListEmployeeDto) {
    return this.employeeService.findAllWithMeta(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('self')
  @UseInterceptors(FileInterceptor('photo'))
  async updateProfile(
    @Req() req: any,
    @Body() dto: UpdateEmployeeSelfDto,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    return this.employeeService.updateSelf(req.user.employeeId, dto, photo);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdateEmployeeAdminDto,
    @UploadedFile(ImageFileValidationPipe) photo?: any,
  ) {
    return this.employeeService.updateEmployee(id, dto, photo);
  }
}
