import { INestApplication, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database');
    } catch (error: any) {
      this.logger.error('Failed to connect to the database', error.message);
      throw error;
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      try {
        await app.close();
        this.logger.log('Application shutdown gracefully');
      } catch (error) {
        this.logger.error('Error during application shutdown', error);
      }
    });
  }
}
