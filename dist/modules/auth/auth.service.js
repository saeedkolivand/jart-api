"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_service_1 = require("../shared/config/config.service");
const prisma_service_1 = require("../shared/prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(email, password) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: email.toLowerCase()
                }
            });
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash || '');
            if (!isPasswordValid) {
                return null;
            }
            const { passwordHash } = user, result = __rest(user, ["passwordHash"]);
            return result;
        }
        catch (error) {
            this.logger.error(`Error validating user: ${error.message}`, error.stack);
            return null;
        }
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.id || !user.email) {
            throw new common_1.UnauthorizedException('Invalid user data');
        }
        const payload = {
            sub: user.id.toString(),
            email: user.email
        };
        try {
            const accessToken = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRATION'),
            });
            const userResponse = {
                id: user.id,
                email: user.email,
                name: user.name,
            };
            return {
                access_token: accessToken,
                user: userResponse,
            };
        }
        catch (error) {
            this.logger.error('Error generating JWT token', error);
            throw new common_1.UnauthorizedException('Could not generate access token');
        }
    }
    async validateToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_service_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map