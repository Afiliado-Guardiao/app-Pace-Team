import { randomInt } from "crypto";

/**
 * Gera um código de referência aleatório de 10 caracteres
 * Formato: letras maiúsculas e números, com no mínimo 3 letras
 * @returns Código de 10 caracteres (ex: "A1B2C3D4E5")
 */
export function generateReferralCode(): string {
	const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const NUMBERS = "0123456789";
	const ALL_CHARS = LETTERS + NUMBERS;
	const CODE_LENGTH = 10;
	const MIN_LETTERS = 3;

	let code = "";

	for (let i = 0; i < MIN_LETTERS; i++) {
		const randomIndex = randomInt(0, LETTERS.length);
		const char = LETTERS.charAt(randomIndex);
		code += char;
	}

	for (let i = MIN_LETTERS; i < CODE_LENGTH; i++) {
		const randomIndex = randomInt(0, ALL_CHARS.length);
		const char = ALL_CHARS.charAt(randomIndex);
		code += char;
	}

	const chars = code.split("");
	for (let i = chars.length - 1; i > 0; i--) {
		const j = randomInt(0, i + 1);
		const charI = chars[i];
		const charJ = chars[j];
		if (charI !== undefined && charJ !== undefined) {
			chars[i] = charJ;
			chars[j] = charI;
		}
	}

	return chars.join("");
}

/**
 * Normaliza um código de referência para a forma canônica do servidor:
 * remove espaços (bordas e internos), descarta qualquer caractere fora de
 * `[A-Z0-9]` e converte para maiúsculas. Espelha o helper do app
 * (`base-app/src/lib/referral/normalizeReferralCode`) pra que client e
 * server aceitem exatamente o mesmo input.
 * Deve ser o único ponto onde essa transformação ocorre — usar sempre
 * esta função em vez de inlinar a lógica.
 *
 * @param input - Código a ser normalizado (pode conter espaços, minúsculas, hífens)
 * @returns Código normalizado (ex: " abc 123-xx " → "ABC123XX")
 */
export function normalizeReferralCode(input: string): string {
	return input
		.trim()
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, "");
}

/**
 * Valida o formato de um código de referência personalizado
 * Regras:
 * - Entre 3 e 10 caracteres
 * - Apenas letras (A-Z) e números (0-9)
 * - Letras devem ser maiúsculas
 * - Mínimo de 3 letras
 *
 * @param code - Código a ser validado
 * @returns true se válido, false caso contrário
 */
export function validateReferralCodeFormat(code: string): {
	valid: boolean;
	error?: string;
} {
	const MIN_LENGTH = 3;
	const MAX_LENGTH = 10;
	const MIN_LETTERS = 3;

	if (code.length < MIN_LENGTH) {
		return {
			valid: false,
			error: `Código deve ter no mínimo ${String(MIN_LENGTH)} caracteres`,
		};
	}

	if (code.length > MAX_LENGTH) {
		return {
			valid: false,
			error: `Código deve ter no máximo ${String(MAX_LENGTH)} caracteres`,
		};
	}

	const validCharsRegex = /^[A-Z0-9]+$/;
	if (!validCharsRegex.test(code)) {
		return {
			valid: false,
			error: "Código deve conter apenas letras maiúsculas (A-Z) e números (0-9)",
		};
	}

	const letterCount = (code.match(/[A-Z]/g) || []).length;
	if (letterCount < MIN_LETTERS) {
		return {
			valid: false,
			error: `Código deve conter no mínimo ${String(MIN_LETTERS)} letras`,
		};
	}

	return { valid: true };
}
