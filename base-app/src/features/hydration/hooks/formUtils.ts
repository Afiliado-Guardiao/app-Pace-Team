// "70,5" → 70.5; vazio ou inválido → null
export const num = (text: string): number | null => {
	const v = Number(text.replace(",", ".").trim());
	return text.trim() && Number.isFinite(v) && v > 0 ? v : null;
};

export const str = (v: number | null): string => (v === null ? "" : String(v).replace(".", ","));
