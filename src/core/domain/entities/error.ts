import { HttpException, HttpStatus } from "@nestjs/common";

export type ValidationDetails = {
  path: PropertyKey;
  messages: string[];
};

export type ErrorOptions = {
  message: string;
  statusCode: HttpStatus;
  details?: ValidationDetails[];
  rawError?: unknown;
};

export class CustomError extends HttpException {
  readonly details?: ErrorOptions["details"];

  constructor(options: ErrorOptions) {
    super(options.message, options.statusCode);
    this.details = options.details;
  }

  toJSON() {
    const formatter = Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });
    return { name: this.name, message: this.message, details: this.details, timestamp: formatter.format(new Date()) };
  }
}

export class ValidationError extends CustomError {
  constructor(details: ValidationDetails[]) {
    super({
      message: `Os dados fornecidos apresentam problemas de formatação.`,
      statusCode: HttpStatus.BAD_REQUEST,
      details,
    });
  }
}

export class BodyEmptyError extends CustomError {
  constructor() {
    super({
      message: `Pelo menos uma propriedade deve ser enviada para atualização.`,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export class NotFoundError extends CustomError {
  constructor() {
    super({ message: `O Vehiclulo não foi encontrado.`, statusCode: HttpStatus.NOT_FOUND });
  }
}

export class ConflictError extends CustomError {
  constructor() {
    super({
      message: `Houve problemas na realização do cadrasto do veículo.`,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
  }
}
