import type { Vehicle } from "@/core/domain/entities/vehicle.js";
import { ApiProperty } from "@nestjs/swagger";
import { MetaDto } from "./meta.dto.js";
import { VehicleDto } from "./vehicle.dto.js";

export class VehiclesDto {
  @ApiProperty({ description: "Lista de veículos", type: [VehicleDto] })
  data: VehicleDto[] = [];

  @ApiProperty({ description: "Metadados da paginação", type: MetaDto })
  meta!: MetaDto;

  constructor(vehicles: Vehicle[], meta: Meta) {
    if (meta.total > 0) this.data = vehicles.map(item => new VehicleDto(item));
    this.meta = meta;
  }
}
