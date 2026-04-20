import { Renavam } from "./renavam.js";

describe(Renavam.name, () => {
  test("deve aceitar RENAVAM com 9 dígitos", () => {
    expect(() => new Renavam("123456790")).not.toThrow();
  });

  test("deve aceitar RENAVAM com 11 dígitos", () => {
    expect(() => new Renavam("12345678901")).not.toThrow();
  });

  test.each(["12345679", "123456789012"])("deve rejeitar RENAVAM %s com comprimento diferente", value => {
    expect(() => new Renavam(value)).toThrow("RENAVAM deve ter 9 ou 11 dígitos");
  });

  test("deve rejeitar RENAVAM com letras", () => {
    expect(() => new Renavam("1234567890A")).toThrow("RENAVAM deve conter apenas números");
  });
});
