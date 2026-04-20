import { Chassi } from "./chassi.js";

describe(Chassi.name, () => {
  test("deve aceitar chassi válido", () => {
    expect(() => new Chassi("9BG116GW0SU100297")).not.toThrow();
  });

  test("deve rejeitar chassi com comprimento incorreto", () => {
    expect(() => new Chassi("ABC123")).toThrow("Chassi deve ter 17 caracteres");
  });

  test("deve rejeitar chassi com letra I (inválida)", () => {
    expect(() => new Chassi("9BG116GW0SU10029I")).toThrow("Chassi contém caracteres inválidos");
  });

  test("deve rejeitar chassi com letra O (inválida)", () => {
    expect(() => new Chassi("9BG116GW0SU10029O")).toThrow("Chassi contém caracteres inválidos");
  });

  test("deve rejeitar chassi com letra Q (inválida)", () => {
    expect(() => new Chassi("9BG116GW0SU10029Q")).toThrow("Chassi contém caracteres inválidos");
  });
});
