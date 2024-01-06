import { InjectModel } from '@nestjs/mongoose';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Message } from 'src/infra/schemas/Message';
import { NewMessageI } from 'src/infra/types/NewMessage';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { User } from 'src/infra/schemas/User';
import { randomNameChooser } from 'src/functions/randomNameChooser';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const name = await randomNameChooser();
      const newUser = await this.userModel.create({
        socket_id: socket.id,
        name: name,
      });
      const user = await newUser.save();
      socket.emit('me', user);
      const allMessages = await this.messageModel.find().populate('user_id');
      this.server.emit('getMessages', allMessages);
      socket.on('disconnect', async () => {
        await this.userModel.updateOne(
          { socket_id: socket.id },
          { is_deleted: true },
        );
      });
    });
  }
  @SubscribeMessage('newMessage')
  async onNewMessage(@MessageBody() body: NewMessageI) {
    if (!body.text || !body.user_id) {
      this.server.emit('error', {
        message: 'Please field all required fields',
      });
      return;
    }
    const newMessage = await this.messageModel.create(body);
    newMessage.save();
    const allMessages = await this.messageModel.find().populate('user_id');

    this.server.emit('getMessages', allMessages);
  }
}
