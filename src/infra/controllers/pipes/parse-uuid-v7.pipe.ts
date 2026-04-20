// custom-uuid.pipe.ts
import { ValidationError } from "@/core/domain/entities/error.js";
import { Injectable, type PipeTransform } from "@nestjs/common";
import { isUUID } from "class-validator";

@Injectable()
export class ParseUUIDv7Pipe implements PipeTransform {
  transform(value: string): string {
    if (isUUID(value, "7")) return value;
    throw new ValidationError([{ path: "id", messages: [`Version 7 para UUID está inválido.`] }]);
  }
}
