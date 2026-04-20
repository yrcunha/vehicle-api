import { BeforeUpdate, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v7 } from "uuid";
import { Chassi } from "../objects/chassi.js";
import { Plate } from "../objects/plate.js";
import { Renavam } from "../objects/renavam.js";

@Entity({ tableName: "veiculos" })
export class Vehicle {
  @PrimaryKey({ type: "uuid", fieldName: "_id" })
  id = v7();

  @Embedded(() => Plate, { prefix: false })
  plate: Plate;

  @Embedded(() => Chassi, { prefix: false })
  chassi: Chassi;

  @Embedded(() => Renavam, { prefix: false })
  renavam: Renavam;

  @Property({ type: "text", fieldName: "modelo" })
  model: string;

  @Property({ type: "text", fieldName: "marca" })
  make: string;

  @Property({ type: "varchar", length: 4, fieldName: "ano" })
  year: string;

  @Property({ type: "varchar", length: 4, fieldName: "ano_modelo" })
  modelYear: string;

  @Property({ type: "date", fieldName: "criado_em" })
  readonly createdAt: Date = new Date();

  @Property({ type: "date", fieldName: "atualizado_em" })
  updatedAt: Date = new Date();

  @Property({ type: "boolean", fieldName: "deletado", default: false })
  deleted: boolean;

  @BeforeUpdate()
  onUpdate() {
    this.updatedAt = new Date();
  }

  constructor(
    plate: Plate,
    chassi: Chassi,
    renavam: Renavam,
    model: string,
    make: string,
    year: string,
    modelYear: string,
  ) {
    this.plate = plate;
    this.chassi = chassi;
    this.renavam = renavam;
    this.model = model;
    this.make = make;
    this.year = year;
    this.modelYear = modelYear;
  }
}
