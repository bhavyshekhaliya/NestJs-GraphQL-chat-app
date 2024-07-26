import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Message } from './entities/message.entity';
import { MessageSchema } from './entities/message.document';
import { ChatModule } from '../chat.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [
        DatabaseModule.forFeature([
            {
                name: Message.name,
                schema: MessageSchema
            }
        ]),
        forwardRef(() => ChatModule),
        forwardRef(() => UserModule),
    ],
    providers: [
        MessageService,
        MessageResolver
    ]
})
export class MessageModule {}
