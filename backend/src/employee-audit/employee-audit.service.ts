import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeAudit } from './entities/employee-audit.entity';

@Injectable()
export class EmployeeAuditService {
  constructor(
    @InjectRepository(EmployeeAudit, 'audit')
    private readonly repo: Repository<EmployeeAudit>,
  ) { }

  async create(payload: any) {
    await this.repo.save({ employeeId: payload.employeeId, payload });
  }
}
