import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { DatabaseModule } from 'src/common/database/database.module';
import { Message } from './entities/message.entity';
import { MessageSchema } from './entities/message.document';

@Module({
    imports: [
        DatabaseModule.forFeature([
            {
                name: Message.name,
                schema: MessageSchema
            }
        ])
    ],
    providers: [
        MessageService,
        MessageResolver
    ]
})
export class MessageModule { }
