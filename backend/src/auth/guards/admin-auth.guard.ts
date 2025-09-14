import { Injectable } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminAuthGuard extends JwtAuthGuard {
  handleRequest(err, user) {
    if (err || !user) throw err || new UnauthorizedException();
    if (user.roleId !== 1) throw new ForbiddenException('Only admin can access this resource');
    return user;
  }
}