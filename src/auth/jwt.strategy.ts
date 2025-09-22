import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.["access_token"],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "dev",
    });
  }
  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
