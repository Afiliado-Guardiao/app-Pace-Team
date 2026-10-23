// Interpreta números no formato pt-BR ("2.140", "32,4", "+86", "4º") como o
// CountUp do design system. Textos que não são números (ritmo 5'12", tempos
// 45:25) não animam e aparecem como estão.

export interface ICountUpParts {
	isNumeric: boolean;
	prefix: string;
	suffix: string;
	target: number;
	decimals: number;
	grouping: boolean;
	raw: string;
}

const NUMBER_PATTERN = /^([+-]?)(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(.*)$/;
const NON_NUMERIC_SUFFIX = /^['":h]/;

export const parseCountUp = (value: string | number | null | undefined): ICountUpParts => {
	const raw = value === null || value === undefined ? "" : String(value);
	const match = NUMBER_PATTERN.exec(raw);
	const [, sign = "", digits = "0", rest = ""] = match ?? [];
	const isNumeric = !!match && !NON_NUMERIC_SUFFIX.test(rest);
	const num = isNumeric ? digits : "0";
	const [, fraction = ""] = num.split(",");
	const decimals = fraction.length;

	return {
		isNumeric,
		prefix: isNumeric ? sign : "",
		suffix: isNumeric ? rest : "",
		target: parseFloat(num.replace(/\./g, "").replace(",", ".")),
		decimals,
		grouping: num.includes("."),
		raw,
	};
};

export const formatCountUp = (current: number, parts: ICountUpParts): string => {
	if (!parts.isNumeric) return parts.raw;

	const shown = Math.max(0, current).toLocaleString("pt-BR", {
		minimumFractionDigits: parts.decimals,
		maximumFractionDigits: parts.decimals,
		useGrouping: parts.grouping,
	});

	return `${parts.prefix}${shown}${parts.suffix}`;
};

// easeOutBack: passa um pouco do valor e assenta (overshoot do design system)
export const easeOutBack = (t: number, overshoot = 1.70158): number => {
	const c3 = overshoot + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};
