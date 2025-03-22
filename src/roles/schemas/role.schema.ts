import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true }) name: string;
  @Prop({ type: [String], default: [] }) scopes: string[];
  @Prop({ type: Number, required: true }) rank: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);