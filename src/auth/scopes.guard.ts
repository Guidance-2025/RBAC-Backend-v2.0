import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles/schemas/role.schema';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.get<string[]>('scopes', context.getHandler());
    if (!requiredScopes) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role as Role;

    const hasScope = requiredScopes.every(scope => userRole.scopes.includes(scope));
    if (!hasScope) throw new ForbiddenException('Access denied: Insufficient scopes');

    return true;
  }
}