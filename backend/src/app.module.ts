import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { User } from './entities/user.entity';
import { Employee } from './entities/employee.entity';
import { Attendance } from './entities/attendance.entity';
import { AttendanceStatus } from './entities/attendance-status.entity';
import { Position } from './entities/position.entity';
import { Role } from './entities/role.entity';

@Module({
  imports: [
    //registers the .env file outside of backend folder
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_ROOT_USERNAME,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Employee, Attendance, AttendanceStatus, Position, Role]),
    AuthModule,
    EmployeesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
