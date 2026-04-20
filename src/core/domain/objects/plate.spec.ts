import { Plate } from "./plate.js";

describe(Plate.name, () => {
  describe("Formato Antigo", () => {
    test.each(["ABC1234", "XYZ9876", "AAA0000"])("deve aceitar placa antiga %s no formato antigo válida", value => {
      expect(() => new Plate(value)).not.toThrow();
    });

    test.each(["AB12345", "ABCD123", "ABC123", "ABC12A4"])(
      "deve rejeitar placa antiga %s com formato inválido",
      value => {
        expect(() => new Plate(value)).toThrow(`Placa em formato antigo inválida.`);
      },
    );

    test("deve rejeitar placa antiga com letras minúsculas", () => {
      expect(() => new Plate("abc1234")).toThrow("Placa em formato antigo inválida.");
    });
  });

  describe("Plate - Formato Mercosul", () => {
    test.each(["ABC1D23", "XYZ9A00", "BRA0Z11"])("deve aceitar placa %s no formato Mercosul válida", value => {
      expect(() => new Plate(value)).not.toThrow();
    });

    test.each(["ABC1DD3", "ABC1D2"])("deve rejeitar placa Mercosul %s com formato inválido", value => {
      expect(() => new Plate(value)).toThrow(`Placa em formato Mercosul inválida.`);
    });

    test("deve rejeitar placa Mercosul com letras minúsculas", () => {
      expect(() => new Plate("abc1d23")).toThrow("Placa em formato Mercosul inválida.");
    });
  });
});
