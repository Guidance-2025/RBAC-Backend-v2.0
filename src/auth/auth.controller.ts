import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';

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

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.name, dto.email, dto.password, dto.gender, dto.age);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}