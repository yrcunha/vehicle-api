import "dotenv/config";

import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module.js";
import swaggerConfig from "./infra/configs/swagger.config.js";
import { ValidationPipe } from "./infra/controllers/pipes/validation.pipe.js";

(async () => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app
    .use(helmet())
    .useGlobalPipes(new ValidationPipe())
    .setGlobalPrefix("api")
    .enableVersioning({ type: VersioningType.URI, defaultVersion: "1" })
    .enableShutdownHooks();

  swaggerConfig(app);

  await app.listen(process.env.PORT);

  process.on("SIGTERM", () => {
    logger.log("SIGTERM received, closing application...");
  });
})();
