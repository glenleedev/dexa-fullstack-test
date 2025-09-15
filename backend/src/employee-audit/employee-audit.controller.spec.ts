import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeAuditController } from './employee-audit.controller';

describe('AuditController', () => {
  let controller: EmployeeAuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeAuditController],
    }).compile();

    controller = module.get<EmployeeAuditController>(EmployeeAuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
