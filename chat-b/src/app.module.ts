import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.gateway.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Firdavs:20080805Firdavs@chat.diln91p.mongodb.net/',
    ),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
