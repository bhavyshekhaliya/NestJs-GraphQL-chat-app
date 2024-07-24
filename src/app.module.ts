import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatModule } from './modules/chat/chat.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './common/database/database.module';
import { PubSubModule } from './common/pub-sub/pub-sub.module';
import { ExampleModule } from './example/example.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [ChatModule, UserModule, AuthModule, DatabaseModule, PubSubModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
