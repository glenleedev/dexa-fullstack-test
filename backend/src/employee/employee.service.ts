import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { UserService } from '../user/user.service';
import { Position } from './entities/position.entity';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';
import { UpdateEmployeeAdminDto } from './dto/update-employee-admin.dto';
import { UpdateEmployeeSelfDto } from './dto/update-employee-self.dto';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private employees: Repository<Employee>,
    private readonly userService: UserService,
    @InjectRepository(Position) private positions: Repository<Position>,
  ) { }

  async findById(userId: number) {
    //get from user Service (microservice concept)
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('Employee data not found');
    //for position, joins directly
    const emp = await this.employees.findOne({
      where: { user: { id: userId } },
      relations: ['position'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        photo: true,
        position: { name: true },
      },
    });
    if (!emp) throw new NotFoundException('Employee data not found');

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      phone: emp.phone,
      photo: emp.photo,
      email: emp.email,
      position: emp.position?.name,
      role: user.role?.name,
    };
  }

  private async savePhotoFile(photo: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'employees');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const uniqueName = `${uuidv4()}${path.extname(photo.originalname)}`;
    const fullPath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(fullPath, photo.buffer);
    return `uploads/employees/${uniqueName}`;
  }

  private async deletePhotoFile(photoPath: string) {
    const fullPath = path.join(process.cwd(), photoPath);
    await unlink(fullPath).catch(() => null);
  }

  async create(
    data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      positionId: number;
      password: string;
      roleId: number
    },
    photo?: Express.Multer.File
  ) {
    const existing = await this.userService.findByUsername(data.email);
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const user = await this.userService.create({
      username: data.email,
      password: data.password,
      roleId: data.roleId,
    });

    let photoPath: string | undefined = undefined;
    if (photo) photoPath = await this.savePhotoFile(photo);

    const position = await this.positions.findOne({ where: { id: data.positionId } });
    const emp = this.employees.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      photo: photoPath,
      user,
      position,
    });
    await this.employees.save(emp);
    return this.findById(user.id);
  }

  async remove(employeeId: number) {
    const emp = await this.employees.findOne({ where: { id: employeeId } });
    if (!emp) throw new NotFoundException('Employee not found');
    if (emp.photo) this.deletePhotoFile(emp.photo);
    await this.employees.remove(emp);
    await this.userService.remove(emp.userId);
  }

  async findAllWithMeta({ page = 1, limit = 10 }: { page?: number; limit?: number; positionId?: number }) {
    const where: any = {};
    const [data, total] = await this.employees.findAndCount({
      where,
      relations: ['position'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data: data.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  //update employee's own profile (allowed: password, phone, photo)
  async updateSelf(id: number, dto: UpdateEmployeeSelfDto, photo?: any) {
    const emp = await this.employees.findOne({ where: { id } });
    if (!emp) throw new NotFoundException();

    const payload: Partial<Employee> = {
      phone: dto.phone ?? emp.phone
    };

    if (photo) {
      if (emp.photo) await this.deletePhotoFile(emp.photo);
      payload.photo = await this.savePhotoFile(photo);
    }
    try {
      await this.employees.update(emp.id, payload);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicate value for unique field');
      }
    }

    if (dto.password) await this.userService.updatePassword(emp.userId, dto.password);
    return this.findById(emp.userId);
  }

  //update any employee by HR admin (allowed: any but password)
  async updateEmployee(id: number, dto: UpdateEmployeeAdminDto, photo?: any) {
    const emp = await this.employees.findOne({ where: { id } });
    if (!emp) throw new NotFoundException();

    if (dto.positionId !== undefined) {
      const pos = await this.positions.findOne({ where: { id: dto.positionId } });
      if (!pos) throw new NotFoundException('Position not found');
    }

    const payload: Partial<Employee> = {
      firstName: dto.firstName ?? emp.firstName,
      lastName: dto.lastName ?? emp.lastName,
      email: dto.email ?? emp.email,
      phone: dto.phone ?? emp.phone,
      positionId: dto.positionId ?? emp.positionId,
    };

    if (photo) {
      if (emp.photo) await this.deletePhotoFile(emp.photo);
      payload.photo = await this.savePhotoFile(photo);
    }

    try {
      await this.employees.update(id, payload);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicate value for unique field');
      }
      throw err;
    }

    if (dto.roleId !== undefined) {
      await this.userService.updateRole(emp.userId, dto.roleId);
    }

    return this.findById(id);
  }

  async findManyByName(search: string) {
    return this.employees.find({
      where: [
        { firstName: Like(`%${search}%`) },
        { lastName: Like(`%${search}%`) },
      ],
    });
  }

  async findManyByIds(ids: number[]) {
    if (!ids.length) return [];
    return this.employees.find({
      where: { id: In(ids) },
      relations: ['position'],
    });
  }
}
