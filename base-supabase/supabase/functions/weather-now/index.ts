// =============================================================================
// Edge Function: weather-now
// -----------------------------------------------------------------------------
// Tempo de agora no ponto de quem usa o app (céu e pista do Início):
//   1. Radar (RainViewer, a cada 10 min, ~1,2 km por pixel) no ponto exato:
//      se está chovendo ali e quanto.
//   2. Aeroporto mais perto (METAR do NOAA, observação de verdade): temperatura,
//      céu fechado e trovoada.
//   3. Reserva: previsão da MET Norway (temperatura e céu) sem radar/aeroporto.
// Dia/noite pelo nascer e pôr do sol da posição.
//
// Privacidade: o app manda a posição arredondada (~1 km). Para o radar vai só
// o "quadrado" do mapa (~300 km) e para o NOAA uma área de ~100 km.
//
// Seguranca: verify_jwt ligado (só quem está logado). Sem segredos.
// =============================================================================

import { PNG } from "npm:pngjs@7";
import { Buffer } from "node:buffer";

type IPreset = "day" | "hot" | "cold" | "night" | "rain" | "storm" | "cloudy";

const UA = "PaceTeam/1.0 github.com/Afiliado-Guardiao/app-Pace-Team";
const TIMEOUT_MS = 7000;
const RADAR_ZOOM = 7;
const RADAR_MAX_AGE_S = 30 * 60;
const METAR_BOX_DEG = 0.45;
const METAR_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const METAR_NEAR_KM = 25;

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200): Response =>
	new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const fetchT = async (url: string, init?: RequestInit): Promise<Response | null> => {
	const c = new AbortController();
	const t = setTimeout(() => c.abort(), TIMEOUT_MS);
	try {
		return await fetch(url, { ...init, signal: c.signal, headers: { "User-Agent": UA, ...(init?.headers ?? {}) } });
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
};

const km = (a: [number, number], b: [number, number]): number => {
	const r = Math.PI / 180;
	const dLat = (b[0] - a[0]) * r, dLng = (b[1] - a[1]) * r;
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLng / 2) ** 2;
	return 12742 * Math.asin(Math.sqrt(h));
};

// ---- 1. Radar ----------------------------------------------------------------

// 0 nada · 1 chuvisco · 2 chuva · 3 chuva forte · 4 temporal
const levelOf = (r: number, g: number, b: number, a: number): number => {
	if (a < 40) return 0;
	if (r > 150 && b > 150 && g < 120) return 4; // rosa/roxo
	if (r > 200 && g < 150) return 4; // laranja/vermelho
	if (r > 190 && g > 140 && b < 110) return 3; // amarelo
	if (b >= r && g >= 150) return 1; // azul claro
	if (b >= r) return 2; // azul
	return 1;
};

interface IRadar {
	here: number;
	near: number;
}

async function readRadar(lat: number, lng: number): Promise<IRadar | null> {
	const maps = await fetchT("https://api.rainviewer.com/public/weather-maps.json");
	if (!maps?.ok) return null;
	const j = (await maps.json()) as { host: string; radar: { past: { time: number; path: string }[] } };
	const last = j.radar?.past?.at(-1);
	if (!last || Date.now() / 1000 - last.time > RADAR_MAX_AGE_S) return null;
	const n = 2 ** RADAR_ZOOM;
	const fx = ((lng + 180) / 360) * n;
	const s = Math.sin((lat * Math.PI) / 180);
	const fy = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n;
	const tx = Math.floor(fx), ty = Math.floor(fy);
	const px = Math.floor((fx - tx) * 256), py = Math.floor((fy - ty) * 256);
	const tile = await fetchT(`${j.host}${last.path}/256/${RADAR_ZOOM}/${tx}/${ty}/2/0_0.png`);
	if (!tile?.ok) return null;
	const png = PNG.sync.read(Buffer.from(await tile.arrayBuffer()));
	const at = (x: number, y: number): number => {
		if (x < 0 || y < 0 || x > 255 || y > 255) return 0;
		const i = (y * 256 + x) * 4;
		return levelOf(png.data[i], png.data[i + 1], png.data[i + 2], png.data[i + 3]);
	};
	let here = 0, near = 0;
	for (let dy = -3; dy <= 3; dy++) {
		for (let dx = -3; dx <= 3; dx++) {
			const v = at(px + dx, py + dy);
			if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) here = Math.max(here, v);
			else near = Math.max(near, v);
		}
	}
	return { here, near };
}

// ---- 2. Aeroporto (METAR) ----------------------------------------------------

interface IMetar {
	icao: string;
	distKm: number;
	temp: number | null;
	wx: string;
	cloudy: boolean;
}

async function readMetar(lat: number, lng: number): Promise<IMetar | null> {
	const b = METAR_BOX_DEG;
	const box = [lat - b, lng - b, lat + b, lng + b].map((v) => v.toFixed(2)).join(",");
	const url = `https://aviationweather.gov/api/data/metar?format=json&bbox=${box}`;
	const res = await fetchT(url);
	if (!res?.ok) return null;
	const list = (await res.json().catch(() => [])) as {
		icaoId: string; lat: number; lon: number; reportTime: string; temp?: number; wxString?: string;
		clouds?: { cover: string; base?: number }[];
	}[];
	const fresh = list
		.filter((m) => Date.now() - new Date(m.reportTime).getTime() < METAR_MAX_AGE_MS)
		.map((m) => ({ m, d: km([lat, lng], [m.lat, m.lon]) }))
		.sort((x, y) => x.d - y.d);
	const best = fresh.at(0);
	if (!best) return null;
	const { m, d } = best;
	const cloudy = (m.clouds ?? []).some((c) => (c.cover === "BKN" || c.cover === "OVC") && (c.base ?? 0) <= 6000);
	return { icao: m.icaoId, distKm: d, temp: m.temp ?? null, wx: m.wxString ?? "", cloudy };
}

// ---- 3. Reserva: MET Norway ---------------------------------------------------

async function readMet(lat: number, lng: number): Promise<{ temp: number | null; symbol: string } | null> {
	const res = await fetchT(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(2)}&lon=${lng.toFixed(2)}`);
	if (!res?.ok) return null;
	const j = (await res.json()) as { properties?: { timeseries?: { data: { instant: { details: { air_temperature?: number } }; next_1_hours?: { summary: { symbol_code: string } } } }[] } };
	const d = j.properties?.timeseries?.[0]?.data;
	return d ? { temp: d.instant.details.air_temperature ?? null, symbol: d.next_1_hours?.summary.symbol_code ?? "" } : null;
}

// ---- Sol ---------------------------------------------------------------------

// Elevação do sol (graus) — fórmula simplificada do NOAA
const sunElevation = (lat: number, lng: number, now: Date): number => {
	const r = Math.PI / 180;
	const day = Math.floor((now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000);
	const hour = now.getUTCHours() + now.getUTCMinutes() / 60;
	const g = ((2 * Math.PI) / 365) * (day - 1 + (hour - 12) / 24);
	const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g);
	const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
	const solarMin = hour * 60 + eqt + 4 * lng;
	const ha = (solarMin / 4 - 180) * r;
	const cosZ = Math.sin(lat * r) * Math.sin(decl) + Math.cos(lat * r) * Math.cos(decl) * Math.cos(ha);
	return 90 - Math.acos(Math.max(-1, Math.min(1, cosZ))) / r;
};

// ---- Decisão -------------------------------------------------------------------

const RAIN_MM = [0, 0.8, 3, 7, 14];

interface IDecision {
	preset: IPreset;
	rainMmH: number;
}

function decide(o: { radar: IRadar | null; metar: IMetar | null; met: { symbol: string } | null; temp: number | null; isDay: boolean }): IDecision {
	const { radar, metar, met, temp, isDay } = o;
	const near = metar && metar.distKm <= METAR_NEAR_KM ? metar : null;
	const thunder = Boolean(near && /TS/.test(near.wx));
	// Chuva agora no aeroporto (não "chuva recente" RE nem "nas proximidades" VC)
	const metarRain = near ? /(RA|DZ|SH|TS)/.test(near.wx) && !/^(RE|VC)/.test(near.wx) : false;
	const metarNearby = near ? /^(RE|VC)/.test(near.wx) : false;
	if (radar) {
		if (radar.here >= 4 || (radar.here >= 2 && thunder)) return { preset: "storm", rainMmH: RAIN_MM[4] };
		if (radar.here > 0) return { preset: "rain", rainMmH: RAIN_MM[radar.here] };
		if (radar.near > 0 || metarRain) return { preset: "cloudy", rainMmH: 0 };
	} else if (near && metarRain) {
		if (thunder) return { preset: "storm", rainMmH: RAIN_MM[4] };
		return { preset: "rain", rainMmH: /\+/.test(near.wx) ? RAIN_MM[3] : /-/.test(near.wx) ? RAIN_MM[1] : RAIN_MM[2] };
	}
	if (metarNearby) return { preset: "cloudy", rainMmH: 0 };
	const cloudySky = near?.cloudy || /cloudy|fog|rain|sleet|snow/.test(met?.symbol ?? "") && !/partlycloudy/.test(met?.symbol ?? "");
	if (cloudySky) return { preset: "cloudy", rainMmH: 0 };
	if (temp !== null && temp <= 10) return { preset: "cold", rainMmH: 0 };
	if (!isDay) return { preset: "night", rainMmH: 0 };
	if (temp !== null && temp >= 32) return { preset: "hot", rainMmH: 0 };
	return { preset: "day", rainMmH: 0 };
}

Deno.serve(async (req: Request): Promise<Response> => {
	if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
	if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
	const input = (await req.json().catch(() => null)) as { lat?: unknown; lng?: unknown } | null;
	const lat = Number(input?.lat), lng = Number(input?.lng);
	if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
		return json({ error: "invalid_position" }, 400);
	}
	const [radar, metar, met] = await Promise.all([
		readRadar(lat, lng).catch(() => null),
		readMetar(lat, lng).catch(() => null),
		readMet(lat, lng).catch(() => null),
	]);
	const temp = metar?.temp ?? met?.temp ?? null;
	const isDay = sunElevation(lat, lng, new Date()) > -0.833;
	const d = decide({ radar, metar, met, temp, isDay });
	return json({
		preset: d.preset,
		temp,
		rainMmH: d.rainMmH,
		isDay,
		source: { radar: radar ? `${String(radar.here)}/${String(radar.near)}` : null, metar: metar?.icao ?? null, metarWx: metar?.wx ?? null },
	});
});
