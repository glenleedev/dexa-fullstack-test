import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee/entities/employee.entity';
import { Position } from './employee/entities/position.entity';
import { Role } from './user/entities/role.entity';
import { User } from './user/entities/user.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { AttendanceStatus } from './attendance/entities/attendance-status.entity';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    //registers the .env file outside of backend folder
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.APP_DB_PORT),
      username: process.env.APP_DB_USERNAME,
      password: process.env.APP_DB_PASSWORD,
      database: process.env.APP_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: false,
    }),
     TypeOrmModule.forRoot({
      name: 'audit',
      type: 'mysql',
      host: process.env.AUDIT_DB_HOST,
      port: Number(process.env.AUDIT_DB_PORT),
      username: process.env.AUDIT_DB_ROOT_USERNAME,
      password: process.env.AUDIT_DB_ROOT_PASSWORD,
      database: process.env.AUDIT_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Employee, Attendance, AttendanceStatus, Position, Role]),
    AuthModule,
    EmployeeModule,
    UserModule,
    AttendanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
