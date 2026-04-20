import type { Vehicle } from "@/core/domain/entities/vehicle.js";
import { ApiProperty } from "@nestjs/swagger";

export class VehicleDto {
  @ApiProperty({ description: "ID único do veículo (UUIDv7)", example: "01234567-89ab-7def-0123-456789abcdef" })
  id!: string;

  @ApiProperty({ description: "Placa do veículo", example: "ABC1D23" })
  plate!: string;

  @ApiProperty({ description: "Chassi do veículo", example: "9BWZZZ377VT004251" })
  chassi!: string;

  @ApiProperty({ description: "RENAVAM do veículo", example: "12345678901" })
  renavam!: string;

  @ApiProperty({ description: "Modelo do veículo", example: "Civic" })
  model!: string;

  @ApiProperty({ description: "Marca do veículo", example: "Honda" })
  make!: string;

  @ApiProperty({ description: "Ano de fabricação", example: "2024" })
  year!: string;

  @ApiProperty({ description: "Ano do modelo", example: "2024" })
  modelYear!: string;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.plate = vehicle.plate.value;
    this.chassi = vehicle.chassi.value;
    this.renavam = vehicle.renavam.value;
    this.model = vehicle.model;
    this.make = vehicle.make;
    this.year = vehicle.year;
    this.modelYear = vehicle.modelYear;
  }
}
