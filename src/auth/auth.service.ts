import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { SignupResponseDto } from './dto/signup.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    // Normalize email if you store it normalized
    const normalizedEmail = email.trim().toLowerCase();

    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async encryptPassword(plainText: string, saltRounds = 10): Promise<string> {
    return await bcrypt.hash(plainText, saltRounds);
  }

  async signup(email: string, password: string): Promise<SignupResponseDto> {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await this.prisma.user.findFirst({ where: { email: normalizedEmail } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hash = await this.encryptPassword(password, 10);

    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hash,
      },
      select: { id: true, email: true },
    });
  }
}
