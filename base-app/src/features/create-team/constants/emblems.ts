import falcao from "../../../../assets/team-emblems/falcao.jpg";
import leao from "../../../../assets/team-emblems/leao.jpg";
import lobo from "../../../../assets/team-emblems/lobo.jpg";
import raposa from "../../../../assets/team-emblems/raposa.jpg";

// Emblemas prontos para quem não tem escudo nem foto da equipe
export const TEAM_EMBLEMS = [
	{ id: "raposa", name: "Raposa", source: raposa },
	{ id: "leao", name: "Leão", source: leao },
	{ id: "lobo", name: "Lobo", source: lobo },
	{ id: "falcao", name: "Falcão", source: falcao },
] as const;

export type ITeamEmblemId = (typeof TEAM_EMBLEMS)[number]["id"];
