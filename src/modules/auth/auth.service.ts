import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { hashData } from 'src/common/common';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, Tokens } from 'src/common/types/common.type';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    // create a new user ( SignUp )
    async createUser(email: string, password: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ email: email });
            if(user) {
                throw new ForbiddenException("User with this email already exists");
            }

            const newUser = await this.userRepository.create({
                email,
                password: await hashData(password)
            });

            const token = await this.getTokens(newUser._id.toString(), newUser.email);

            await this.updateRtHash(newUser._id.toString(), token.refreshToken);

            return {
                ...newUser,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }
        } catch (error) {
            // E11000 is the error code for duplicate key error
            if (error.message.includes('E11000')) {
                throw new UnprocessableEntityException(
                    'User with this email already exists',
                );
            }
            throw error;
        }
    }

    // login the user ( SignIn )
    async login(email: string, password: string) {
        try {
            const checkUser = await this.userRepository.findOne({ email: email });
            if(!checkUser) {
                throw new NotFoundException("User with this email Not exists");
            }

            const user = await this.verifyUser(email, password);

            const token = await this.getTokens(user._id.toString(), user.email);

            await this.updateRtHash(user._id.toString(), token.refreshToken);

            return {
                ...user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }
        } catch (error) {
            throw error;
        }
    }

    // logOut the user
    async logOut(userId: string): Promise<boolean> {
        try {
            const isLoggedOut = await this.userRepository.findOneAndUpdate(
                { _id: userId }, {
                $set: {
                    refreshToken: null
                }
            }
            );

            if (isLoggedOut) {
                return true;
            }
            return false;

        } catch (error) {
            throw error;
        }
    }

    // new access token and refresh token
    async refreshTokens(userId: string, rt: string): Promise<Tokens> {
        const user = await this.userRepository.findOne({ _id: userId });

        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

        const rtMatches = await bcrypt.compare(rt, user.refreshToken);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user._id.toString(), user.email);

        await this.updateRtHash(user._id.toString(), tokens.refreshToken);

        return tokens;
    }

    // validate the user's credentials
    async verifyUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    // upadate the user's refresh token hash
    async updateRtHash(userId: string, rt: string): Promise<void> {
        const hashRt = await hashData(rt);

        await this.userRepository.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    refreshToken: hashRt
                }
            },
        );
    }

    // generate access and refresh tokens for the user
    async getTokens(userId: string, email: string): Promise<Tokens> {

        const tokenPayload: TokenPayload = {
            _id: userId,
            email: email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(tokenPayload, {
                secret: this.configService.getOrThrow<string>('AT_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(tokenPayload, {
                secret: this.configService.getOrThrow<string>('RT_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
        };
    }
}
