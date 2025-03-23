import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class SignupDto {
  name: string;
  email: string;
  password: string;
  gender: string;
  age: number;
}

class LoginDto {
  email: string;
  password: string;
}
@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.name, dto.email, dto.password, dto.gender, dto.age);
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}