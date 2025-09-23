import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared/config/config.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({ 
        where: { 
          email: email.toLowerCase() // Ensure case-insensitive email matching
        } 
      });
      
      if (!user) {
        return null;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash || '');
      
      if (!isPasswordValid) {
        return null;
      }
      
      // Remove sensitive data before returning
      const { passwordHash, ...result } = user;
      return result;
      
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      return null;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Ensure user has an id and email
    if (!user.id || !user.email) {
      throw new UnauthorizedException('Invalid user data');
    }

    const payload: JwtPayload = { 
      sub: user.id.toString(), // Ensure sub is a string
      email: user.email
    };

    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      });

      // Explicitly type the user object to ensure type safety
      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        access_token: accessToken,
        user: userResponse,
      };
    } catch (error) {
      this.logger.error('Error generating JWT token', error);
      throw new UnauthorizedException('Could not generate access token');
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
