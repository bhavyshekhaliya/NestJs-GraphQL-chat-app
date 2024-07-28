import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { ChatModule } from '../chat.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [
        forwardRef(() => ChatModule),
        forwardRef(() => UserModule),
    ],
    providers: [
        MessageService,
        MessageResolver
    ]
})
export class MessageModule {}
