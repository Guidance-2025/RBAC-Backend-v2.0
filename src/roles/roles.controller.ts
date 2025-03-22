import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '../auth/scopes.guard';
import { Scopes } from '../auth/scopes.decorator';
import { RolesService } from './roles.service';

class CreateRoleDto {
  name: string;
  scopes: string[];
  rank: number;
}

@Controller('api/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto.name, dto.scopes, dto.rank);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllRoles() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getRoleById(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  updateRole(@Param('id') id: string, @Body('name') name: string, @Body('scopes') scopes: string[]) {
    return this.rolesService.update(id, name, scopes);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  deleteRole(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}