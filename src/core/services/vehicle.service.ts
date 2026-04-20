import { EntityManager, type FilterQuery } from "@mikro-orm/mongodb";
import { Injectable } from "@nestjs/common";
import { ConflictError, NotFoundError } from "../domain/entities/error.js";
import { Vehicle } from "../domain/entities/vehicle.js";
import { Chassi } from "../domain/objects/chassi.js";
import { Plate } from "../domain/objects/plate.js";
import { Renavam } from "../domain/objects/renavam.js";
import type { CreateVehicleDto } from "./dtos/create-vehicle.dto.js";
import type { QueryVehicleDto } from "./dtos/query-vehicle.dto.js";
import type { UpdateVehicleDto } from "./dtos/update-vehicle.dto.js";

@Injectable()
export class VehicleService {
  constructor(private readonly em: EntityManager) {}

  async list({ page, limit, ...query }: QueryVehicleDto) {
    const filters: FilterQuery<Vehicle> = {};

    if (query.model) filters.model = { $ilike: `%${query.model}%` };
    if (query.make) filters.make = { $ilike: `%${query.make}%` };
    if (query.year) filters.year = query.year;
    if (query.modelYear) filters.modelYear = query.modelYear;

    const offset = (page - 1) * limit;
    const [vehicles, total] = await this.em.findAndCount(Vehicle, filters, {
      limit,
      offset,
      orderBy: { createdAt: "DESC" },
    });

    return {
      data: vehicles,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(data: CreateVehicleDto) {
    const exists = await this.em.count(Vehicle, {
      $or: [{ plate: { value: data.plate } }, { renavam: { value: data.renavam } }, { chassi: { value: data.chassi } }],
    });

    if (exists) throw new ConflictError();

    const vehicle = new Vehicle(
      new Plate(data.plate),
      new Chassi(data.chassi),
      new Renavam(data.renavam),
      data.model,
      data.make,
      data.year,
      data.modelYear,
    );

    this.em.persist(vehicle);
    await this.em.flush();

    return vehicle.id;
  }

  async get(id: string) {
    const vehicle = await this.em.findOne(Vehicle, { id });
    if (vehicle) return vehicle;
    throw new NotFoundError();
  }

  async update(id: string, data: UpdateVehicleDto) {
    const vehicle = await this.em.findOne(Vehicle, { id, deleted: false });
    if (!vehicle) throw new NotFoundError();

    if (data.plate) {
      const exists = await this.em.count(Vehicle, { plate: { value: data.plate } });
      console.log("chegou aqu na placa e existe?", exists);
      if (exists) throw new ConflictError();

      vehicle.plate = new Plate(data.plate);
    }

    if (data.chassi) {
      const exists = await this.em.count(Vehicle, { chassi: { value: data.chassi } });
      console.log("chegou aqu no chassi e existe?", exists);
      if (exists) throw new ConflictError();

      vehicle.chassi = new Chassi(data.chassi);
    }

    if (data.renavam) {
      const exists = await this.em.count(Vehicle, { renavam: { value: data.renavam } });
      console.log("chegou aqu no renavam e existe?", exists);
      if (exists) throw new ConflictError();

      vehicle.renavam = new Renavam(data.renavam);
    }

    if (data.model) vehicle.model = data.model;
    if (data.make) vehicle.make = data.make;
    if (data.year) vehicle.year = data.year;
    if (data.modelYear) vehicle.modelYear = data.modelYear;

    await this.em.flush();
  }

  async delete(id: string) {
    const vehicle = await this.em.findOne(Vehicle, { id, deleted: false });
    if (!vehicle) throw new NotFoundError();
    vehicle.deleted = true;
    await this.em.flush();
  }
}
