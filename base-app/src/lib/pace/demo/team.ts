// Dados de exemplo do protótipo (Shell.jsx). Serão trocados pelo Supabase.
import { IAthlete, IRankedTeam, ITeamMember, ITeamSummary } from "../types";

export const ME: IAthlete = { name: "Lucas Moreira", handle: "@lucas.corre", city: "Campinas, SP" };

export const MY_TEAM: ITeamSummary = {
	name: "Pace Sharks",
	city: "Campinas · SP",
	size: 5,
	rank: 4,
	points: 2140,
	km: 182.4,
};

export const MEMBERS: readonly ITeamMember[] = [
	{ name: "Lucas Moreira", role: "Capitão", km: 32.4, pts: 512, you: true },
	{ name: "Ana Souza", role: "Atleta", km: 41.2, pts: 640 },
	{ name: "Rafael Lima", role: "Atleta", km: 38.0, pts: 488 },
	{ name: "Bia Carvalho", role: "Atleta", km: 36.5, pts: 302 },
	{ name: "Diego Prado", role: "Atleta", km: 34.3, pts: 198 },
];

export const TEAMS: readonly IRankedTeam[] = [
	{ name: "Lobos SP", city: "Campinas", points: 3120, km: 241, delta: 0 },
	{ name: "Night Runners", city: "Campinas", points: 2980, km: 230, delta: 1 },
	{ name: "Trail Kings", city: "Valinhos", points: 2755, km: 214, delta: -1 },
	{ name: "Pace Sharks", city: "Campinas", points: 2140, km: 182, delta: 2, you: true },
	{ name: "Asfalto Quente", city: "Campinas", points: 2055, km: 176, delta: -1 },
	{ name: "Barão Run Club", city: "Campinas", points: 1890, km: 161, delta: 0 },
	{ name: "Ritmo Livre", city: "Paulínia", points: 1720, km: 149, delta: 3 },
];

// Pessoas sugeridas no convite
export const PEOPLE = [
	{ name: "Marina Costa", handle: "@marina.km" },
	{ name: "Pedro Alves", handle: "@pedroalves" },
	{ name: "Júlia Rocha", handle: "@ju.rocha" },
	{ name: "Caio Mendes", handle: "@caiomendes" },
] as const;
