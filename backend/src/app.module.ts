import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuditModule } from './employee-audit/employee-audit.module';
import { join } from 'path';

@Module({
  imports: [
    //registers the .env file outside of backend folder
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'employees'),
      serveRoot: '/uploads/employees',
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
    AuthModule,
    EmployeeModule,
    UserModule,
    AttendanceModule,
    AuditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
