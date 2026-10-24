import { IRankedTeam, IViradaScenario, IViradaState } from "@/lib/pace";
import { IVirada } from "@/lib/supabase";

// Modo Virada no formato das telas (card do Início e tela da disputa).
export interface IViradaRankRow extends IRankedTeam {
	position: number;
}

export interface IViradaContribution {
	name: string;
	role: string;
	points: number;
	you?: boolean;
}

export interface IViradaView {
	state: IViradaState;
	scenario: IViradaScenario;
	// null = títulos padrão do design (prévia)
	title: { start: string; highlight: string } | null;
	team: { name: string; city: string };
	rival: { name: string; city: string };
	// "4º → 3º" ou "Agora em 1º"
	move: string;
	rows: IViradaRankRow[];
	week: { us: readonly number[]; them: readonly number[] };
	headToHead: readonly { week: string; us: number; them: number }[];
	members: IViradaContribution[];
}

const PTS_PER_KM = 8;
const MAX_KM_PER_RUN = 20;
const CLOSE_GAP = 40;
const TIGHT_GAP = 200;

// Texto do que falta: "Uma corrida de 8 km resolve." ou "24 km da equipe resolvem."
const kmToFlip = (gap: number): string => {
	const km = Math.ceil((gap + 1) / PTS_PER_KM);
	return km <= MAX_KM_PER_RUN
		? `Uma corrida de ${String(km)} km resolve.`
		: `${String(km)} km da equipe resolvem.`;
};

type IScenarioPick = Pick<IViradaView, "state" | "scenario" | "title">;
type IScenarioBase = Pick<IViradaScenario, "us" | "rival" | "pos" | "rivalPos">;

// Já estamos à frente do rival (somos o 1º da cidade).
const leading = (base: IScenarioBase, rivalName: string): IScenarioPick => {
	const lead = base.us - base.rival;
	return {
		state: "done",
		title: { start: "Vocês estão", highlight: "na frente!" },
		scenario: {
			...base,
			label: "Na liderança",
			tone: "success",
			icon: "trophy",
			msg: `${String(lead)} pts à frente dos ${rivalName}`,
			sub: `+${String(lead)} pts à frente · ${String(base.pos)}º na cidade`,
			progress: 1,
		},
	};
};

// Rival à frente: perto (ultrapassando) ou ainda longe (disputa).
const chasing = (base: IScenarioBase): IScenarioPick => {
	const gap = base.rival - base.us;
	const progress = base.rival > 0 ? Math.min(0.99, base.us / base.rival) : 0;
	const isClose = gap <= CLOSE_GAP;
	const isTight = gap <= TIGHT_GAP;
	return {
		state: isClose ? "overtaking" : "equal",
		title: isClose
			? { start: "Estamos", highlight: "chegando" }
			: { start: "Placar", highlight: isTight ? "apertado" : "em aberto" },
		scenario: {
			...base,
			label: isClose ? "Quase lá" : isTight ? "Disputa equilibrada" : "Em busca da virada",
			tone: isClose ? "accent" : "warning",
			icon: isClose ? "trending-up" : "scale",
			msg: isClose
				? `Faltam só ${String(gap + 1)} pts!`
				: `Faltam ${String(gap + 1)} pts para ultrapassar`,
			sub: kmToFlip(gap),
			progress,
		},
	};
};

// Estado da disputa a partir do placar real (rival acima = buscando a virada).
const scenarioOf = (data: IVirada): IScenarioPick => {
	const pos = data.team.position;
	const rivalPos = data.rival?.position ?? pos;
	const base = { us: data.team.points, rival: data.rival?.points ?? 0, pos, rivalPos };
	return rivalPos > pos ? leading(base, data.rival?.name ?? "") : chasing(base);
};

export const toViradaView = (data: IVirada): IViradaView => {
	const scenario = scenarioOf(data);
	const { pos, rivalPos } = scenario.scenario;
	return {
		...scenario,
		team: { name: data.team.name, city: data.team.city },
		rival: { name: data.rival?.name ?? "", city: data.rival?.city ?? "" },
		move:
			scenario.state === "done"
				? `Agora em ${String(pos)}º`
				: `${String(pos)}º → ${String(rivalPos)}º`,
		rows: data.rows.map((r) => ({
			id: r.id,
			name: r.name,
			city: r.city,
			points: r.points,
			km: r.km,
			delta: 0,
			you: r.isYou,
			position: r.position,
		})),
		week: { us: data.weekDays.us, them: data.weekDays.them ?? [] },
		headToHead: data.headToHead.map((h) => ({
			week: `Semana ${String(h.week)}`,
			us: h.us,
			them: h.them,
		})),
		members: data.members
			.map((m) => ({
				name: m.name || "Atleta",
				role: m.role === "captain" ? "Capitão" : "Atleta",
				points: m.points,
				you: m.isYou,
			}))
			.sort((a, b) => b.points - a.points),
	};
};
