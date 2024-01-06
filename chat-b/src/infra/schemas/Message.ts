import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './User';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Message {
  @Prop({ required: true })
  text: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true})
  user_id: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
