import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { IsInt, IsOptional, Min } from "class-validator";
import { VehicleDto } from "./base-vehicle.dto.js";

export class QueryVehicleDto extends PartialType(
  PickType(VehicleDto, ["model", "make", "year", "modelYear"] as const),
) {
  @ApiPropertyOptional({ description: "Número da página", example: 1, default: 1 })
  @IsOptional()
  @IsInt({ message: "Página deve ser um número inteiro" })
  @Min(1, { message: "Página deve ser no mínimo 1" })
  page = 1;

  @ApiPropertyOptional({ description: "Quantidade de itens por página", example: 10, default: 10 })
  @IsOptional()
  @IsInt({ message: "Limite deve ser um número inteiro" })
  @Min(1, { message: "Limite deve ser no mínimo 1" })
  limit = 10;
}
