import { ValidationError, type ValidationDetails } from "@/core/domain/entities/error.js";
import { ValidationPipe as Validation } from "@nestjs/common";

export class ValidationPipe extends Validation {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory(errors) {
        const details: ValidationDetails[] = errors.map(error => ({
          path: error.property,
          messages: Object.values(error.constraints!),
        }));
        return new ValidationError(details);
      },
    });
  }
}
