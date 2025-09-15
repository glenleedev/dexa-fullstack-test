import { Controller, Post, Get, Param, Body, Query, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { ListAttendanceAdminDto } from './dto/list-attendance-admin.dto';
import { ListAttendanceSelfDto } from './dto/list-attendance-self.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('self')
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any) {
    return this.attendanceService.recordAttendance(req.user.userId);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  async findAllWithMeta(
    @Req() req: any,
    @Query() dto: ListAttendanceAdminDto,
  ) {
    return this.attendanceService.findAllWithMeta(dto);
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  async findByIdWithMeta(
    @Req() req: any,
    @Query() dto: ListAttendanceSelfDto,
  ) {
    return this.attendanceService.findByIdWithMeta(req.user.employeeId, dto);
  }
}
