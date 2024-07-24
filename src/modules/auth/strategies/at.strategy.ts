import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/user/entities/user.entity";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,'at-jwt') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token'),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('AT_SECRET'),
            passReqToCallback: false,
        })
    }

    async validate(payload: any): Promise<Partial<User>> {
        return { _id: payload._id, email: payload.email };
      }
}