import { Controller, Get, Put, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ScopesGuard } from '../auth/scopes.guard';
import { RankGuard } from '../auth/rank.guard';
import { Scopes } from '../auth/scopes.decorator';
import { UsersService } from './users.service';

class UpdateProfileDto {
  name?: string;
  email?: string;
  gender?: string;
  age?: number;
}

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopesGuard)
  @Scopes('manage_users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('assign-role')
  @UseGuards(AuthGuard('jwt'), ScopesGuard, RankGuard)
  @Scopes('manage_users')
  assignRole(@Body('userId') userId: string, @Body('roleId') roleId: string) {
    return this.usersService.assignRole(userId, roleId);
  }
}