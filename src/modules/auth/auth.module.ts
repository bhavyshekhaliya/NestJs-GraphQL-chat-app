import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
    providers: [
        AuthService,
        AuthResolver,
        AtGuard,
        RtGuard,
        AtStrategy,
        RtStrategy
    ]
})
export class AuthModule {}
