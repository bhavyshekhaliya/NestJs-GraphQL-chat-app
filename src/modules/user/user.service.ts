import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';
import { hashData } from 'src/common/common';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    

    // FindAll user
    async findAll(): Promise<User[]> {
        return (await this.userRepository.find({})).map((userDocument) =>
          this.toEntity(userDocument),
        );
      }

    // Find one user
    async findOne(_id: string): Promise<User> {
        return this.toEntity(await this.userRepository.findOne({ _id }));
    }    

    // Update user
    async update(_id: string, updateUserDto: UpdateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await hashData(
                updateUserDto.password,
          );
        }
        return this.toEntity(
          await this.userRepository.findOneAndUpdate(
            { _id },
            {
              $set: {
                ...updateUserDto,
              },
            },
          ),
        );
      }

    // Remove user
    async remove(_id: string): Promise<User> {
        return this.toEntity(await this.userRepository.findOneAndDelete({ _id }));
    }

    // Convert the UserDocument into the User type
    toEntity(userDocument: UserDocument): User {
        const user = {
          ...userDocument,
        };
        delete user.password;
        return user;
    }
    
}
