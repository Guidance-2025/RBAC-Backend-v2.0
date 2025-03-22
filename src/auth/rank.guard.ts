import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../roles/schemas/role.schema';

@Injectable()
export class RankGuard implements CanActivate {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role as Role;
    const targetRoleId = request.body.roleId;

    const targetRole = await this.roleModel.findById(targetRoleId);
    if (!targetRole) throw new ForbiddenException('Target role not found');

    if (targetRole.rank > userRole.rank) {
      throw new ForbiddenException('Cannot assign a role higher than your own');
    }

    return true;
  }
}