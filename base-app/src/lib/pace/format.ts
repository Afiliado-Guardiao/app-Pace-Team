// Formatação no padrão brasileiro do PACE TEAM: vírgula decimal, ponto de
// milhar, ritmo 5'12" e tempos 45:25 / 1:24:30.

const pad2 = (n: number): string => String(n).padStart(2, "0");

// 3252 s → "54:12" · 5070 s → "1:24:30"
export const formatDuration = (totalSeconds: number): string => {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = s % 60;
	return h ? `${String(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(m)}:${pad2(sec)}`;
};

// segundos por km → 5'07"
export const formatPace = (secondsPerKm: number): string => {
	if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "0'00\"";
	const minutes = Math.floor(secondsPerKm / 60);
	let seconds = Math.round(secondsPerKm % 60);
	let mins = minutes;
	if (seconds === 60) {
		mins += 1;
		seconds = 0;
	}
	return `${String(mins)}'${pad2(seconds)}"`;
};

// 10.583 → "10,58"
export const formatKm = (km: number, decimals = 2): string =>
	km.toFixed(decimals).replace(".", ",");

// 2140 → "2.140"
export const formatPoints = (points: number): string => points.toLocaleString("pt-BR");

// km/h com uma casa: 11,7
export const formatSpeed = (km: number, seconds: number): string =>
	(seconds > 0 ? km / (seconds / 3600) : 0).toFixed(1).replace(".", ",");

// Tempo curto da arte do post: 1610 s → "26m 50s" · 5070 s → "1h 24m"
export const formatDurationShort = (totalSeconds: number): string => {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	return h ? `${String(h)}h ${String(m)}m` : `${String(m)}m ${pad2(s % 60)}s`;
};

// Ritmo em relógio: 307 s/km → "5:07"
export const formatPaceClock = (secondsPerKm: number): string => {
	if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return "0:00";
	const total = Math.round(secondsPerKm);
	return `${String(Math.floor(total / 60))}:${pad2(total % 60)}`;
};

// Distância sem confusão: abaixo de 1 km em metros ("511 m"), depois em km
// ("1,25 km") — "0,51 km" era lido como 51 km
export const distanceParts = (km: number): { value: string; unit: string } =>
	km < 1 ? { value: String(Math.round(km * 1000)), unit: "m" } : { value: formatKm(km), unit: "km" };

// Tempo por extenso, para não parecer hora do relógio: 797 s → "13 min 17 s"
// e 3900 s → "1 h 05 min" ("13:17" era lido como 13 h 17)
export const durationParts = (totalSeconds: number): { value: string; unit: string } => {
	const s = Math.max(0, Math.floor(totalSeconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	return h
		? { value: `${String(h)} h ${pad2(m)}`, unit: "min" }
		: { value: `${String(m)} min ${pad2(s % 60)}`, unit: "s" };
};

// Em texto corrido: "511 m" · "1,25 km"
export const formatDistance = (km: number): string => {
	const { value, unit } = distanceParts(km);
	return `${value} ${unit}`;
};

// Em texto corrido: "13 min 17 s" · "1 h 05 min"
export const formatDurationText = (totalSeconds: number): string => {
	const { value, unit } = durationParts(totalSeconds);
	return `${value} ${unit}`;
};
