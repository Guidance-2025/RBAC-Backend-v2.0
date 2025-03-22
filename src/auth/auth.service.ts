import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string, gender: string, age: number) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = await this.roleModel.findOne({ name: 'user' });
    if (!defaultRole) throw new BadRequestException('Default role not found');

    const user = new this.userModel({ name, email, password: hashedPassword, gender, age, role: defaultRole._id });
    await user.save();

    const payload = { id: user._id, role: defaultRole._id };
    const token = this.jwtService.sign(payload);
    return { message: 'User registered successfully', token, user: { ...user.toObject(), role: defaultRole } };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).populate('role');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { id: user._id, role: user.role._id };
    const token = this.jwtService.sign(payload);
    return { message: 'Login successful', token, user };
  }
}