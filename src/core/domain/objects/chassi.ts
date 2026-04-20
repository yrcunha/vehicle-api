import { Embeddable, Property } from "@mikro-orm/decorators/legacy";

/**
 * SO 3779:2009
 * Road vehicles — Vehicle identification number (VIN) — Content and structure
 */
@Embeddable()
export class Chassi {
  @Property({ type: "varchar", length: 17, fieldName: "chassi" })
  value: string;

  constructor(value: string) {
    if (value.length !== 17) throw new Error("Chassi deve ter 17 caracteres");
    if (!/^[A-HJ-NPR-Z0-9]+$/.test(value)) throw new Error("Chassi contém caracteres inválidos");
    this.value = value;
  }
}
