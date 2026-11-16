// PACE HYDRATION — estimativas de hidratação (não são prescrição médica).
//
// Referências usadas (e só elas — nada de fórmula inventada):
// - EFSA (2010), ingestão adequada de água total para adultos: ~2,0 L/dia
//   (mulheres) e ~2,5 L/dia (homens), dos quais ~70–80% vêm de bebidas.
//   Como o app não sabe o sexo, a base diária usa o peso (30 ml/kg, regra
//   prática comum) e fica presa entre 1,6 e 2,8 L de bebidas por dia.
// - ACSM Position Stand "Exercise and Fluid Replacement" (Sawka et al., 2007):
//   * suor de 0,3 a 2,4 L/h, conforme pessoa, intensidade e clima;
//   * antes: ~5–7 ml/kg cerca de 4 h antes do treino;
//   * durante: evitar perder mais de 2% do peso e NÃO beber mais do que se
//     perde no suor (risco de hiponatremia) — beber pela sede;
//   * depois: ~1,25–1,5 L para cada kg perdido, aos poucos.
// - Taxa de suor pela pesagem: (peso antes − peso depois + líquido bebido) ÷
//   horas. É a forma mais confiável ao alcance do atleta.

export interface IHydroBody {
	weightKg: number | null;
	heightCm: number | null;
	age: number | null;
}

export interface IHydroRun {
	id: string;
	startedAt: string;
	seconds: number;
	km: number;
}

export interface ISweatTest {
	id: string;
	at: number;
	preKg: number;
	postKg: number;
	minutes: number;
	fluidMl: number;
}

const BASE_ML_PER_KG = 30;
const BASE_MIN = 1600;
const BASE_MAX = 2800;
// Sem peso: o meio da faixa da EFSA em bebidas
const BASE_DEFAULT = 2000;
const SWEAT_MIN_LPH = 0.3;
const SWEAT_MAX_LPH = 2.0;
// Teto do dia (corrida longa no calor não vira meta exagerada)
const DAY_MAX = 4500;
const POST_RUN_MAX = 1500;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

// Bebidas do dia a dia, sem treino
export const dailyBaseMl = (body: IHydroBody): number =>
	body.weightKg
		? clamp(Math.round(body.weightKg * BASE_ML_PER_KG), BASE_MIN, BASE_MAX)
		: BASE_DEFAULT;

// Taxa de suor de um teste de pesagem (L/h); null se os números não fecham
export const sweatRateOf = (t: ISweatTest): number | null => {
	if (t.minutes < 20 || t.preKg <= 0 || t.postKg <= 0) return null;
	const lossL = t.preKg - t.postKg + t.fluidMl / 1000;
	const rate = lossL / (t.minutes / 60);
	return rate > 0 && rate < 4 ? rate : null;
};

// Média dos últimos testes válidos (até 3): a taxa pessoal do atleta
export const personalSweatRate = (tests: readonly ISweatTest[]): number | null => {
	const rates = tests
		.slice(0, 3)
		.map(sweatRateOf)
		.filter((r): r is number => r !== null);
	if (rates.length === 0) return null;
	return rates.reduce((a, b) => a + b, 0) / rates.length;
};

// Sem teste de pesagem: estimativa pela intensidade (velocidade), peso e
// calor, sempre dentro da faixa do ACSM
export const estimatedSweatRate = (o: {
	run: IHydroRun;
	body: IHydroBody;
	tempC: number | null;
}): number => {
	const hours = o.run.seconds / 3600;
	const kmh = hours > 0 ? o.run.km / hours : 0;
	let rate = 0.8;
	if (kmh < 8) rate = 0.5;
	else if (kmh > 11) rate = 1.0;
	if (o.body.weightKg) rate *= clamp(o.body.weightKg / 70, 0.75, 1.3);
	if (o.tempC !== null) {
		if (o.tempC >= 30) rate *= 1.35;
		else if (o.tempC >= 25) rate *= 1.2;
		else if (o.tempC <= 12) rate *= 0.8;
	}
	return clamp(rate, SWEAT_MIN_LPH, SWEAT_MAX_LPH);
};

export interface IRunHydration {
	// Suor estimado na corrida (ml)
	lossMl: number;
	// Reposição sugerida, aos poucos nas próximas 2–4 h (ml)
	replaceMl: number;
	// Taxa usada (L/h) e se veio da pesagem do próprio atleta
	rateLph: number;
	isPersonal: boolean;
}

export const runHydration = (o: {
	run: IHydroRun;
	body: IHydroBody;
	tempC: number | null;
	tests: readonly ISweatTest[];
}): IRunHydration => {
	const personal = personalSweatRate(o.tests);
	const rate = personal ?? estimatedSweatRate(o);
	const lossMl = Math.round(rate * (o.run.seconds / 3600) * 1000);
	// Sem pesagem a perda é só estimada: repõe 100% dela (com pesagem, o
	// ACSM indica até 150% do que a balança mostrou)
	const factor = personal ? 1.25 : 1;
	return {
		lossMl,
		replaceMl: Math.min(POST_RUN_MAX, Math.round((lossMl * factor) / 50) * 50),
		rateLph: rate,
		isPersonal: personal !== null,
	};
};

// Estimativa do dia: base + reposição das corridas de hoje (com teto)
export const dayTargetMl = (baseMl: number, runsReplaceMl: number): number =>
	Math.min(DAY_MAX, Math.round((baseMl + runsReplaceMl) / 50) * 50);

// Antes da corrida: 5–7 ml/kg ~4 h antes (ACSM); sem peso, faixa genérica
export const preRunMl = (body: IHydroBody): { min: number; max: number } =>
	body.weightKg
		? {
				min: Math.round((body.weightKg * 5) / 50) * 50,
				max: Math.round((body.weightKg * 7) / 50) * 50,
			}
		: { min: 300, max: 500 };

export type IDuringAdvice = "none" | "sips" | "plan";

// Durante: corrida curta não precisa; média, goles pela sede; longa, plano
export const duringAdvice = (minutes: number): IDuringAdvice => {
	if (minutes < 45) return "none";
	if (minutes <= 90) return "sips";
	return "plan";
};
