import { ITeamMember, MEMBERS, MY_TEAM } from "@/lib/pace";
import { ITeamDetails, ITeamInviteRow } from "@/lib/supabase";

import { sinceLabel, toTeamMember } from "./mappers";

// Equipe no formato das telas (aba Equipe, Detalhes, Convidar, Início).
export interface ITeamView {
	id: string;
	name: string;
	city: string;
	region: string;
	// Código do país (BR, PT, US…)
	country: string;
	// "Campinas · RMC · SP"
	place: string;
	size: number;
	// "5 x 5"
	category: string;
	position: number;
	points: number;
	km: number;
	totalKm: number;
	since: string;
	description: string;
	inviteCode: string;
	// Escudo enviado pelo capitão (null = iniciais)
	logoUrl: string | null;
	isCaptain: boolean;
	isMine: boolean;
	// Ordenados por pontos da semana
	members: ITeamMember[];
	invites: ITeamInviteRow[];
	weekDays: number[];
}

export const toTeamView = (t: ITeamDetails): ITeamView => ({
	id: t.id,
	name: t.name,
	city: t.city,
	region: t.region ?? "",
	country: t.country ?? "BR",
	place: [t.city, t.region, t.state].filter(Boolean).join(" · "),
	size: t.size,
	category: `${String(t.size)} x ${String(t.size)}`,
	position: t.position,
	points: t.points,
	km: t.km,
	totalKm: t.totalKm,
	since: sinceLabel(t.createdAt),
	description: t.description ?? "",
	inviteCode: t.inviteCode,
	logoUrl: t.logoUrl,
	isCaptain: t.isCaptain,
	isMine: t.isMine,
	members: t.members.map(toTeamMember).sort((a, b) => b.pts - a.pts),
	invites: t.invites,
	weekDays: t.weekDays,
});

// Prévia por link: a equipe de exemplo do design (Pace Sharks).
export const DEMO_TEAM_VIEW: ITeamView = {
	id: "demo",
	name: MY_TEAM.name,
	city: "Campinas",
	region: "RMC",
	country: "BR",
	place: "Campinas · Região Metropolitana · SP",
	size: MY_TEAM.size,
	category: `${String(MY_TEAM.size)} x ${String(MY_TEAM.size)}`,
	position: MY_TEAM.rank,
	points: MY_TEAM.points,
	km: MY_TEAM.km,
	totalKm: 2418,
	since: "Desde mar 2026",
	description:
		"Corredores de Campinas que treinam juntos no Taquaral às terças e no Barão aos domingos.",
	inviteCode: "PACESHRK",
	logoUrl: null,
	isCaptain: true,
	isMine: true,
	members: [...MEMBERS].sort((a, b) => b.pts - a.pts),
	invites: [
		{ id: "i1", name: "Ana Souza", status: "accepted" },
		{ id: "i2", name: "Rafael Lima", status: "pending" },
	],
	weekDays: [6.2, 7.8, 5.4, 9, 7, 9.6, 4],
};
