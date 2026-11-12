// Passagem da equipe do onboarding para a conta antiga do atleta (login da Apple)
export type ITeamHandoffChoice = "auto" | "move" | "stay";

export interface ITeamHandoffResult {
	// moved: levou a equipe · stayed: ficou na antiga · choose: precisa escolher
	// gone: nada a fazer (token vencido, equipe sumiu)
	status: "moved" | "stayed" | "choose" | "gone";
	teamName?: string;
	currentTeamName?: string;
}

// Resultado guardado no app até o atleta escolher (status "choose")
export interface ITeamHandoff extends ITeamHandoffResult {
	token: string;
}
