import { Embeddable, Property } from "@mikro-orm/decorators/legacy";

/**
 * https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes/resolucao7292018consolidada.pdf
 */
@Embeddable()
export class Plate {
  @Property({ type: "varchar", length: 8, fieldName: "placa" })
  value: string;

  constructor(value: string) {
    this.validatePlate(value);
    this.value = value;
  }

  private validatePlate(value: string) {
    const fifthChar = value[4];
    if (/[0-9]/.test(fifthChar!)) {
      this.validateOld(value);
    } else {
      this.validateMercosul(value);
    }
  }

  private validateOld(value: string) {
    if (/^[A-Z]{3}[0-9]{4}$/.test(value)) return;
    throw new Error("Placa em formato antigo inválida.");
  }

  private validateMercosul(value: string) {
    if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(value)) return;
    throw new Error("Placa em formato Mercosul inválida.");
  }
}
