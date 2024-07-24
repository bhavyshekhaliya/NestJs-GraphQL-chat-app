import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,'rt-jwt') {
    constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromHeader('token'),
            ignoreExpiration:false,
            secretOrKey: configService.get<string>('RT_SECRET'),
            passReqToCallback: false,
        });
    }

    async validate(payload: any) {
        return payload
    }    
}