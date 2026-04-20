import { CustomError } from "@/core/domain/entities/error.js";
import { Catch, HttpException, HttpStatus, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { PinoLogger } from "nestjs-pino";

@Catch()
export class ExceptionMiddleware implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: PinoLogger,
  ) {}

  catch(error: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const isCustom = error instanceof CustomError;
    const formatter = Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });
    const responseBody = {
      message: isCustom ? error.message : "Erro inesperado do sistema.",
      timestamp: formatter.format(new Date()),
      details: isCustom ? error.details : undefined,
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
    };

    const httpStatus = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const logData = {
      error: {
        name: error.name,
        message: error.message,
        details: responseBody.details,
        stack: error.stack,
        statusCode: httpStatus,
      },
    };

    if (httpStatus >= 500) {
      this.logger.error(logData, `Resposta com erro`, error.stack);
    } else {
      this.logger.warn(logData, `Resposta com aviso`, error.stack);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
