import { BodyEmptyError } from "@/core/domain/entities/error.js";
import { CreateVehicleDto } from "@/core/services/dtos/create-vehicle.dto.js";
import { QueryVehicleDto } from "@/core/services/dtos/query-vehicle.dto.js";
import { UpdateVehicleDto } from "@/core/services/dtos/update-vehicle.dto.js";
import { VehicleService } from "@/core/services/vehicle.service.js";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { isNotEmptyObject } from "class-validator";
import { ParseUUIDv7Pipe } from "../pipes/parse-uuid-v7.pipe.js";
import { InsertDto } from "./dtos/insert.dto.js";
import { VehicleDto } from "./dtos/vehicle.dto.js";
import { VehiclesDto } from "./dtos/vehicles.dto.js";

@ApiTags("vehicles")
@Controller({ path: "vehicles", version: "1" })
export class VehicleController {
  constructor(private readonly service: VehicleService) {}

  @Get()
  @ApiOperation({
    summary: "Listar veículos",
    description: "Retorna uma lista paginada de veículos com filtros opcionais",
  })
  @ApiOkResponse({ description: "Lista de veículos retornada com sucesso", type: VehiclesDto })
  async list(@Query() query: QueryVehicleDto) {
    const result = await this.service.list(query);
    return new VehiclesDto(result.data, result.meta);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Criar veículo",
    description: "Cria um novo veículo. Placa, chassi e RENAVAM devem ser únicos.",
  })
  @ApiCreatedResponse({ description: "Veículo criado com sucesso", type: InsertDto })
  async create(@Body() data: CreateVehicleDto) {
    const result = await this.service.create(data);
    return new InsertDto(result);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar veículo", description: "Retorna os dados de um veículo específico por ID" })
  @ApiParam({
    name: "id",
    description: "ID do veículo (UUIDv7)",
    example: "01234567-89ab-7def-0123-456789abcdef",
  })
  @ApiOkResponse({ description: "Veículo encontrado", type: VehicleDto })
  async get(@Param("id", ParseUUIDv7Pipe) id: string) {
    const result = await this.service.get(id);
    return new VehicleDto(result);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Atualizar veículo",
    description: "Atualiza parcialmente os dados de um veículo",
  })
  @ApiParam({
    name: "id",
    description: "ID do veículo (UUIDv7)",
    example: "01234567-89ab-7def-0123-456789abcdef",
  })
  @ApiNoContentResponse({ description: "Veículo atualizado com sucesso" })
  update(@Param("id", ParseUUIDv7Pipe) id: string, @Body() data: UpdateVehicleDto) {
    if (isNotEmptyObject(data)) return this.service.update(id, data);
    throw new BodyEmptyError();
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Excluir veículo", description: "Realiza soft delete de um veículo (marca como deletado)" })
  @ApiParam({
    name: "id",
    description: "ID do veículo (UUIDv7)",
    example: "01234567-89ab-7def-0123-456789abcdef",
  })
  @ApiNoContentResponse({ description: "Veículo excluído com sucesso" })
  delete(@Param("id", ParseUUIDv7Pipe) id: string) {
    return this.service.delete(id);
  }
}
