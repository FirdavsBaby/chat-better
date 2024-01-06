import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({ required: true })
  socket_id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, default: false })
  is_deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
