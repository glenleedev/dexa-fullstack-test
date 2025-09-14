import { ForbiddenException } from '@nestjs/common';

export function checkAdmin(roleId: Number) {
  if (roleId !== 1) {
    throw new ForbiddenException('Only admin can access this resource');
  }
}
