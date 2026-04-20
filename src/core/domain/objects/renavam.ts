import { Embeddable, Property } from "@mikro-orm/decorators/legacy";

@Embeddable()
export class Renavam {
  @Property({ type: "varchar", length: 11, fieldName: "renavam" })
  value: string;

  constructor(value: string) {
    const length = value.length;
    if (!(length === 9 || length === 11)) throw new Error("RENAVAM deve ter 9 ou 11 dígitos");
    if (!/^\d+$/.test(value)) throw new Error("RENAVAM deve conter apenas números");
    this.value = value;
  }
}
