import { normalizeReferralCode } from "../normalizeReferralCode";

describe("normalizeReferralCode", () => {
  it("converte lowercase para uppercase", () => {
    expect(normalizeReferralCode("abc123")).toBe("ABC123");
  });

  it("remove espaços e normaliza", () => {
    expect(normalizeReferralCode("  aBc 123  ")).toBe("ABC123");
  });

  it("remove caracteres especiais como hífen", () => {
    expect(normalizeReferralCode("abc-123")).toBe("ABC123");
  });

  it("retorna string vazia para input vazio", () => {
    expect(normalizeReferralCode("")).toBe("");
  });

  it("retorna string vazia para input só com espaços", () => {
    expect(normalizeReferralCode("   ")).toBe("");
  });

  it("remove emojis e mantém apenas [A-Z0-9]", () => {
    expect(normalizeReferralCode("😀ABC")).toBe("ABC");
  });

  it("é idempotente em input já normalizado", () => {
    expect(normalizeReferralCode("UPPER")).toBe("UPPER");
  });

  it("aceita código só com números", () => {
    expect(normalizeReferralCode("123")).toBe("123");
  });

  it("converte letra única lowercase", () => {
    expect(normalizeReferralCode("a")).toBe("A");
  });
});
