import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { Position } from './entities/position.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, Position]),
    UserModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
