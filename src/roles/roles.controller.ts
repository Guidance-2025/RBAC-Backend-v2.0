import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '../auth/scopes.guard';
import { Scopes } from '../auth/scopes.decorator';
import { RolesService } from './roles.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

class CreateRoleDto {
  name: string;
  scopes: string[];
  rank: number;
}
@ApiTags('Roles')
@ApiBearerAuth()
@Controller('api/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post()
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto.name, dto.scopes, dto.rank);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllRoles() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role details' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getRoleById(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  
  @ApiOperation({ summary: 'Update a role' })
  @ApiParam({ name: 'id', required: true, description: 'Role ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        scopes: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  updateRole(@Param('id') id: string, @Body('name') name: string, @Body('scopes') scopes: string[]) {
    return this.rolesService.update(id, name, scopes);
  }

  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', required: true, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_roles')
  deleteRole(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}