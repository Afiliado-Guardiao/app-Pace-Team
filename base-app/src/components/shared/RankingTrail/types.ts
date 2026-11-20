import { IRankedTeam } from "@/lib/pace";

// Equipe posicionada na trilha (pés em x, y do mundo do mapa)
export interface IPlacedTeam {
	team: IRankedTeam;
	rank: number;
	x: number;
	y: number;
	scale: number;
	// Olha para a direita (o próximo colocado acima está à direita)
	faceRight: boolean;
}
