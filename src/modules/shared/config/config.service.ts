import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

type EnvType = {
  // App
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  
  // Database
  DATABASE_URL: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  
  // AWS S3
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
  
  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  
  // Email
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  
  // Frontend
  FRONTEND_URL: string;
};

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get<T extends keyof EnvType>(key: T): EnvType[T] {
    return this.nestConfigService.get<EnvType[T]>(key) as EnvType[T];
  }
}
