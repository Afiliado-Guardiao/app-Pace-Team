/**
 * Normaliza um código de indicação para o formato canônico do app.
 * Remove espaços, converte para uppercase e descarta qualquer caractere
 * fora do range [A-Z0-9] — espelhando o `.transform` do `applyReferralCodeSchema`
 * no servidor (Fase 4 do plano).
 */
export function normalizeReferralCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
