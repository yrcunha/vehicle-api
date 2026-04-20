import { PartialType } from "@nestjs/swagger";
import { VehicleDto } from "./base-vehicle.dto.js";

export class UpdateVehicleDto extends PartialType(VehicleDto) {}
