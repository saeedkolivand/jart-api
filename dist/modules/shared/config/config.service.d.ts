import { ConfigService as NestConfigService } from '@nestjs/config';
type EnvType = {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_S3_BUCKET: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
    FRONTEND_URL: string;
};
export declare class ConfigService {
    private nestConfigService;
    constructor(nestConfigService: NestConfigService);
    get<T extends keyof EnvType>(key: T): EnvType[T];
}
export {};
