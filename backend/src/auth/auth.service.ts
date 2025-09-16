import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
    private employeeService: EmployeeService,
  ) {}

  async validate(email: string, password: string) {
    const user = await this.users.findOne({ where: { username: email }, relations: ['role'] });
    if (!user) throw new UnauthorizedException();
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) throw new UnauthorizedException();
    const emp = await this.employeeService.findByUserId(user.id);
    if (!emp) throw new NotFoundException('Employee data not found');
    const payload = {
      id: user.id,
      employeeId: emp.id,
      roleId: user.role?.id,
      roleName: user.role?.name,
      email: user?.username,
      firstName: emp?.firstName,
      lastName: emp?.lastName,
    };
    return { access_token: this.jwt.sign(payload) };
  }
}
