import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { Position } from './entities/position.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { UserModule } from '../user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, Position]),
    ConfigModule, 
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'api',
              brokers: [`${config.get('RED_PANDA_HOST')}:${config.get('RED_PANDA_PORT')}`],
            },
            producerOnlyMode: true,
          },
        }),
      },
    ]),
    UserModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
