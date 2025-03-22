import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Import Types from mongoose
import { User, UserDocument } from './schemas/user.schema';
import { Role, RoleDocument } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('role').select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('role').select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: any): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).populate('role').select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async assignRole(userId: string, roleId: string): Promise<User> {
    const user = await this.userModel.findById(userId).populate('role');
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleModel.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    // Fix: Convert roleId to a proper ObjectId
    user.role = new Types.ObjectId(roleId);
    await user.save();
    return user.populate('role');
  }
}