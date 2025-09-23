import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@shared/config/config.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
