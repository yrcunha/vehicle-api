import { MongoDriver } from "@mikro-orm/mongodb";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { LoggerModule } from "nestjs-pino";
import { VehicleService } from "./core/services/vehicle.service.js";
import database from "./infra/configs/database.js";
import loggerConfig from "./infra/configs/logger.config.js";
import { ExceptionMiddleware } from "./infra/controllers/middlewares/exception.middleware.js";
import { VehicleController } from "./infra/controllers/v1/vehicle.controller.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [database], envFilePath: ".env" }),
    LoggerModule.forRoot(loggerConfig),
    MikroOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.getOrThrow("database"),
      inject: [ConfigService],
      driver: MongoDriver,
    }),
  ],
  controllers: [VehicleController],
  providers: [{ provide: APP_FILTER, useClass: ExceptionMiddleware }, VehicleService],
})
export class AppModule {}
