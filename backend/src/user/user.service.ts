import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Role) private roles: Repository<Role>,
  ) { }
  async findByUsername(username: string): Promise<User | null> {
    return this.users.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) return;
    user.password = await bcrypt.hash(newPassword, 10);
    await this.users.save(user);
  }

  async updateRole(id: number, roleId: number): Promise<void> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const roleExists = await this.users.manager.findOne('Role', { where: { id: roleId } });
    if (!roleExists) throw new NotFoundException('Role not found');
    user.role = { id: roleId } as any;
    await this.users.save(user);
  }

  async create(data: { username: string; password: string; roleId: number }) {
    const user = this.users.create({
      username: data.username,
      password: await bcrypt.hash(data.password, 10),
      role: { id: data.roleId } as any,
    });
    return this.users.save(user);
  }

  async remove(id: number) {
    await this.users.delete(id);
  }

  async findManyByIds(ids: number[]) {
    if (!ids.length) return [];
    return this.users.find({
      where: { id: In(ids) },
      relations: ['role'],
    });
  }

  async findMasterRole() {
    return this.roles.find({});
  }
}
