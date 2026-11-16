import { ITeamGame, ITeamGameCell, ITeamGameLevel, ITeamGameSpin } from "@/lib/supabase";

// Roleta de mentira só para a prévia por link (sem servidor). Mesmas casas e
// pontos de public.team_game_wheel / team_game_stakes.
const WHEELS: Record<ITeamGameLevel, ITeamGameCell[]> = {
	facil: [
		{ km: 2, pace: 450 },
		{ km: 3, pace: 420 },
		{ km: 2, pace: 420 },
		{ km: 3, pace: 450 },
		{ km: 4, pace: 450 },
		{ km: 2, pace: 405 },
		{ km: 3, pace: 405 },
		{ km: 4, pace: 420 },
	],
	medio: [
		{ km: 4, pace: 390 },
		{ km: 5, pace: 375 },
		{ km: 5, pace: 360 },
		{ km: 6, pace: 390 },
		{ km: 4, pace: 345 },
		{ km: 6, pace: 360 },
		{ km: 7, pace: 375 },
		{ km: 5, pace: 345 },
	],
	dificil: [
		{ km: 6, pace: 330 },
		{ km: 8, pace: 345 },
		{ km: 7, pace: 315 },
		{ km: 10, pace: 345 },
		{ km: 8, pace: 315 },
		{ km: 6, pace: 300 },
		{ km: 10, pace: 330 },
		{ km: 12, pace: 345 },
	],
};

const STAKES: Record<ITeamGameLevel, { win: number; lose: number }> = {
	facil: { win: 25, lose: 10 },
	medio: { win: 35, lose: 15 },
	dificil: { win: 50, lose: 20 },
};

export const demoStartGame = (level: ITeamGameLevel, names: readonly string[]): ITeamGame => ({
	id: "demo",
	level,
	status: "spinning",
	isStarter: true,
	starterName: "Você",
	createdAt: new Date().toISOString(),
	endsAt: null,
	isSuccess: null,
	wheel: WHEELS[level],
	stakes: STAKES[level],
	players: ["Você", ...names].map((name, slot) => ({
		userId: `demo-${String(slot)}`,
		name,
		avatarPath: null,
		isYou: slot === 0,
		slot,
		challenge: null,
		km: null,
		pace: null,
		assignedAt: null,
		status: "pending",
		points: null,
	})),
});

export const demoSpinGame = (game: ITeamGame): ITeamGameSpin | null => {
	const open = game.players.filter((p) => p.challenge === null);
	if (open.length === 0) return null;
	const pick = open[Math.floor(Math.random() * open.length)];
	const challenge = Math.floor(Math.random() * game.wheel.length);
	const cell = game.wheel[challenge];
	const players = game.players.map((p) =>
		p.userId === pick.userId
			? { ...p, challenge, km: cell.km, pace: cell.pace, assignedAt: new Date().toISOString() }
			: p,
	);
	const isLast = open.length === 1;
	const next: ITeamGame = {
		...game,
		players,
		status: isLast ? "running" : "spinning",
		endsAt: isLast ? new Date(Date.now() + 3 * 3600_000).toISOString() : null,
	};
	return { userId: pick.userId, challenge, game: next };
};
