import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAudit } from './entities/employee-audit.entity';
import { EmployeeAuditService } from './employee-audit.service';
import { EmployeeAuditController } from './employee-audit.controller';
  
@Module({ 
  imports: [
    TypeOrmModule.forFeature([EmployeeAudit], 'audit'),
  ],
  controllers: [EmployeeAuditController],
  providers: [EmployeeAuditService]
})
export class AuditModule {}
