import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AdminAuthGuard)
  @Get('master/role')
  async findMasterRole(@Req() req: any) {
    return this.userService.findMasterRole();
  }
}

