import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceStatus } from './entities/attendance-status.entity';
import { EmployeeService } from '../employee/employee.service';
import { ListAttendanceAdminDto } from './dto/list-attendance-admin.dto';
import { ListAttendanceSelfDto } from './dto/list-attendance-self.dto';
import * as moment from 'moment';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private attendances: Repository<Attendance>,
    @InjectRepository(AttendanceStatus) private statuses: Repository<AttendanceStatus>,
    private readonly employeeService: EmployeeService,
  ) { }

  formatAttendanceDate(date: Date) {
    return {
      attendDt: moment(date).format('DD-MM-YYYY'),
      attendTm: moment(date).format('HH:mm:ss'),
    };
  }

  async recordAttendance(employeeId: number) {
    const employee = await this.employeeService.findById(employeeId);
    if (!employee) throw new NotFoundException('Employee not found');
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    //get all attendance records for today
    const records = await this.attendances.find({
      where: { employeeId, attendanceDttm: Between(todayStart, todayEnd) },
      relations: ['status'],
      order: { attendanceDttm: 'ASC' },
    });

    //first hit, create check in record
    if (records.length === 0) {
      const saved = await this.attendances.save(
        this.attendances.create({
          employeeId,
          //1 is for check in
          status: { id: 1 },
          attendanceDttm: moment().toDate(),
        }),
      );
      return {
        attendDt: moment(saved.attendanceDttm).format('DD-MM-YYYY'),
        attendTm: moment(saved.attendanceDttm).format('HH:mm:ss'),
        status: saved.status.id,
      };
    }

    //for second hit and onwards, do insert or update based on if check out record exists or not
    const outRecord = [...records].reverse().find(r => r.status.id === 2);
    const attendance = this.attendances.create({
      //if undefined create a new record, else update attend dttm
      id: outRecord?.id,
      employeeId,
      //2 is for check out
      status: { id: 2 },
      attendanceDttm: moment().toDate(),
    });

    const saved = await this.attendances.save(attendance);
    return {
      attendDt: moment(saved.attendanceDttm).format('DD-MM-YYYY'),
      attendTm: moment(saved.attendanceDttm).format('HH:mm:ss'),
      status: saved.status.id,
    };
  }

  async findAllWithMeta(dto: ListAttendanceAdminDto) {
    //attendance date range filter
    const where: any = {};
    if (dto.from && dto.to) where.attendanceDttm = Between(new Date(dto.from), new Date(dto.to));

    //search by employee name filter if required
    if (dto.search) {
      const matched = await this.employeeService.findManyByName(dto.search);
      if (!matched.length)
        return { data: [], meta: { total: 0, page: dto.page, limit: dto.limit, totalPages: 0 } };
      where.employeeId = In(matched.map((e) => e.id));
    }

    //query attendance data with pagination
    const [data, total] = await this.attendances.findAndCount({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      order: { attendanceDttm: 'ASC' },
      relations: ['status']
    });

    if (!data.length)
      return { data: [], meta: { total: 0, page: dto.page, limit: dto.limit, totalPages: 0 } };

    //make a unique list of employee ids from attendance data
    const ids = [...new Set(data.map((a) => a.employeeId))];

    //fetch employee details from service
    const employees = await this.employeeService.findManyByIds(ids);
    //turn into a map for quick access
    const map = new Map(employees.map((e) => [e.id, e]));

    const filtered = data.map((a) => {
      const { attendDt, attendTm } = this.formatAttendanceDate(a.attendanceDttm);
      return {
        attendDt,
        attendTm,
        status: a.status?.name ?? null,
        statusId: a.statusId,
        email: map.get(a.employeeId)?.email ?? null,
        firstName: map.get(a.employeeId)?.firstName ?? null,
        lastName: map.get(a.employeeId)?.lastName ?? null,
        position: map.get(a.employeeId)?.position?.name ?? null,
      };
    });

    return {
      data: filtered,
      meta: {
        total,
        page: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }

  async findByIdWithMeta(employeeId: number, dto: ListAttendanceSelfDto) {
    const employee = await this.employeeService.findById(employeeId);
    if (!employee) throw new NotFoundException('Employee not found');
    
    const where: any = { employeeId };
    if (dto.from && dto.to) {
      where.attendanceDttm = Between(new Date(dto.from), new Date(dto.to));
    }

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;

    const [data, total] = await this.attendances.findAndCount({
      where,
      relations: ['status'],
      order: { attendanceDttm: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const flattened = data.map((a) => ({
      attendDt: moment(a.attendanceDttm).format('DD-MM-YYYY'),
      attendTm: moment(a.attendanceDttm).format('HH:mm:ss'),
      status: a.status?.name ?? null,
      statusId: a.statusId,
    }));

    const summary = {
      in: await this.attendances.count({ where: { ...where, status: { id: 1 } } }),
      out: await this.attendances.count({ where: { ...where, status: { id: 2 } } }),
    };

    return {
      data: flattened,
      summary,
       meta: {
        total,
        page: dto.page,
        totalPages: Math.ceil(total / dto.limit),
      },
    };
  }
}
