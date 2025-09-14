import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
  ) {}
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
}
