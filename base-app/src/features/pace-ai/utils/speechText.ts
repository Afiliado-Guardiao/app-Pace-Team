// Prepara a resposta do Buddy para ser lida em voz alta: tira o que a voz lê
// "de robô" (símbolos, emojis, marcadores) e escreve por extenso números de
// corrida (ritmo, tempo, km), como uma pessoa falaria.

const plural = (n: number, one: string, many: string): string =>
	`${String(n)} ${n === 1 ? one : many}`;

// 5'07" (/km) → 5 minutos e 7 segundos por quilômetro
const paceText = (_: string, m: string, s: string, perKm?: string): string => {
	const min = Number(m);
	const sec = Number(s);
	const base = sec
		? `${plural(min, "minuto", "minutos")} e ${plural(sec, "segundo", "segundos")}`
		: plural(min, "minuto", "minutos");
	return perKm ? `${base} por quilômetro` : base;
};

// 1:24:30 → 1 hora, 24 minutos e 30 segundos
const longTime = (_: string, h: string, m: string, s: string): string => {
	const parts = [plural(Number(h), "hora", "horas"), plural(Number(m), "minuto", "minutos")];
	return Number(s)
		? `${parts.join(", ")} e ${plural(Number(s), "segundo", "segundos")}`
		: parts.join(" e ");
};

const RULES: [RegExp, string | ((...args: string[]) => string)][] = [
	// Markdown e marcadores de lista
	[/\*\*|__|`|#+\s?/g, ""],
	[/^\s*(?:[•*\-–]|\d+[.)])\s+/gm, ""],
	// Emojis e setas
	[/\p{Extended_Pictographic}|\u{FE0F}|\u{200D}|[→←↑↓]/gu, ""],
	[/(\d{1,2})['’](\d{2})["”]?(\s*\/\s*km)?/g, paceText],
	[/\b(\d{1,2}):(\d{2}):(\d{2})\b/g, longTime],
	// "às 19:10" é horário (19 e 10); o resto, como "em 54:12", é duração
	[/(\s|^)(às|as|das|até)\s(\d{1,2}):(\d{2})\b/gi, "$1$2 $3 e $4"],
	[/(^|[^\d:])(\d{1,2}):(\d{2})\b/g, (_, b, mm, ss) => `${b}${paceText(_, mm, ss)}`],
	[/km\/h/gi, "quilômetros por hora"],
	[/\/\s*km\b/gi, " por quilômetro"],
	[/\b1([.,]0)?\s?km\b/gi, "1 quilômetro"],
	[/\bkm\b/gi, "quilômetros"],
	[/\bpts\b/gi, "pontos"],
	[/\bbpm\b/gi, "batimentos por minuto"],
	[/\bmin\b/gi, "minutos"],
	[/(\d)\s?%/g, "$1 por cento"],
	[/\bvs\.?\s/gi, "contra "],
	[/\s&\s/g, " e "],
	[/\bml\b/gi, "mililitros"],
];

export const toSpeechText = (raw: string): string => {
	let text = raw;
	for (const [re, to] of RULES) {
		text = typeof to === "string" ? text.replace(re, to) : text.replace(re, to as never);
	}
	// Quebra de linha sem pontuação vira uma pausa de frase
	return text
		.split(/\n+/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => (/[.!?:;…,]$/.test(line) ? line : `${line}.`))
		.join(" ")
		.replace(/\s{2,}/g, " ")
		.trim();
};

const MIN_CHUNK = 40;

// Frase por frase: a voz do iPhone respira entre elas e a entonação fica mais
// natural do que lendo um bloco inteiro. Frases curtas vão juntas.
export const splitSentences = (text: string): string[] => {
	const parts = text.split(/(?<=[.!?…])\s+/).filter(Boolean);
	const out: string[] = [];
	for (const part of parts) {
		const last = out.at(-1);
		if (last !== undefined && last.length < MIN_CHUNK) out[out.length - 1] = `${last} ${part}`;
		else out.push(part);
	}
	return out;
};
