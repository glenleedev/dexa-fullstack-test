import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeAuditService } from './employee-audit.service';

@Controller()
export class EmployeeAuditController {
  constructor(private readonly auditService: EmployeeAuditService) {}

  @MessagePattern('employee.self.updated')
  async handleEmployeeSelfUpdate(@Payload() payload: any) {
    await this.auditService.create(payload);
  }
}
