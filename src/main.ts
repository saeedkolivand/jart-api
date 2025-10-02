import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Job Application Tracker API")
    .setDescription("API for tracking job applications")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth", // This name is used as the security scheme name in the @ApiBearerAuth() decorator
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req: Record<string, unknown>): Record<string, unknown> => {
        if (typeof req.headers === "object" && req.headers !== null) {
          (req.headers as Record<string, string>)["x-swagger-bypass"] = "1";
        }
        return req;
      },
    },
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
