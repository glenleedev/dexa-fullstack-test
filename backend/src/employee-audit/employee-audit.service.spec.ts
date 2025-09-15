import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeAuditService } from './employee-audit.service';

describe('EmployeeAuditService', () => {
  let service: EmployeeAuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeAuditService],
    }).compile();

    service = module.get<EmployeeAuditService>(EmployeeAuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
