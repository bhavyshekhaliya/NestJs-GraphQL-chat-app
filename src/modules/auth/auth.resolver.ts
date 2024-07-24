import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { AtGuard } from './guards/at.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currectUser.decorator';
import { Tokens } from 'src/common/types/common.type';
import { RtGuard } from './guards/rt.guard';

@Resolver()
export class AuthResolver {

    constructor(
        private readonly authService: AuthService
    ) {}

     // Hello World
     @Query(() => String)
     async hello() {
         return "Hello World!";
     }
 
     @Query(() => User)
     @UseGuards(AtGuard)
     async me(@CurrentUser() user: any): Promise<User> {
         if (!user) {
             throw new Error('User not authenticated');
           }
           return user;
     }
 
     // CreateUser
     @Mutation(() => User)
     async createUser(
         @Args('email') email: string, 
         @Args('password') password: string
     ) {
         return this.authService.createUser(email, password);
     }
 
     // Login
     @Mutation(() => User)
     async login( 
         @Args('email') email: string, 
         @Args('password') password: string
     ) {
         return this.authService.login(email, password);
     }
 
     // Refresh Tokens
     @Mutation(() => Tokens)
     @UseGuards(RtGuard)
     async refreshTokens(
         @Args('userId') userId: string,
         @Args('refreshToken') refreshToken: string
     ): Promise<Tokens> {
         return this.authService.refreshTokens(userId, refreshToken);
     }
 
     // logOut
     @Mutation(() => Boolean)
     @UseGuards(RtGuard)
     async logOut(@Args('userId') userId: string) {
         return this.authService.logOut(userId);
     }
}
