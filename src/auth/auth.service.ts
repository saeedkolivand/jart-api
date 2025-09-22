import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}
  async validateAndIssue(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      !user.passwordHash ||
      !(await argon2.verify(user.passwordHash, password))
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.jwt.sign({ sub: user.id, email: user.email });
  }
}
