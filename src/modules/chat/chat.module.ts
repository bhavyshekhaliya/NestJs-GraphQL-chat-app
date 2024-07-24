import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [MessageModule],
  providers: [
    ChatService, 
    ChatResolver,
    ChatRepository
  ]
})
export class ChatModule {}
