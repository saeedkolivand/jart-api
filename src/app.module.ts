import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health/health.controller";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ApplicationsModule } from "./applications/applications.module";
import { ContactsModule } from "./contacts/contacts.module";
import { NotesModule } from "./notes/notes.module";
import { TasksModule } from "./tasks/tasks.module";
import { QueueModule } from "./queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    ApplicationsModule,
    ContactsModule,
    NotesModule,
    TasksModule,
    QueueModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
