import { Controller, Get, Put, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '../auth/scopes.guard';
import { RankGuard } from '../auth/rank.guard';
import { Scopes } from '../auth/scopes.decorator';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

class UpdateProfileDto {
  name?: string;
  email?: string;
  gender?: string;
  age?: number;
}

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get all users (Admin Only)' })
  @ApiResponse({ status: 200, description: 'All users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get()
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  
  @ApiOperation({ summary: 'Assign role to user (Admin Only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        roleId: { type: 'string', description: 'Role ID' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('assign-role')
  @UseGuards(AuthGuard('jwt'), ScopesGuard, RankGuard)
  @Scopes('manage_users')
  assignRole(@Body('userId') userId: string, @Body('roleId') roleId: string) {
    return this.usersService.assignRole(userId, roleId);
  }
}