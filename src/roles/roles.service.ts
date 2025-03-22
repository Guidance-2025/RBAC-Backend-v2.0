import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async create(name: string, scopes: string[], rank: number): Promise<Role> {
    const role = new this.roleModel({ name, scopes, rank });
    return role.save();
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, name: string, scopes: string[]): Promise<Role> {
    const role = await this.roleModel.findByIdAndUpdate(id, { name, scopes }, { new: true });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async delete(id: string): Promise<void> {
    const result = await this.roleModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Role not found');
  }
}