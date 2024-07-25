import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { User } from './entities/user.entity';
import { UserSchema } from './entities/user.document';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
          name: User.name,
          schema: UserSchema
      }
  ]),
  ],
  providers: [
    UserRepository,
    UserService, 
    UserResolver    
  ],
  exports: [
    UserRepository,
    UserService
  ]
})
export class UserModule {}
