import { IMyPro } from "@/lib/supabase";

// Situação do atleta diante do Team Pro (decide o cartão e se mostra os planos)
export type IProStateKind =
	| "loading"
	| "noTeam"
	| "covered"
	| "overLimit"
	| "canLink"
	| "captainFree"
	| "memberFree";

export const proStateOf = (pro: IMyPro | null): IProStateKind => {
	if (!pro) return "loading";
	if (!pro.teamId) return "noTeam";
	if (pro.teamPro) return pro.isPro ? "covered" : "overLimit";
	if (pro.isCaptain && pro.hasOwnSub && pro.ownSubTeamId !== pro.teamId) return "canLink";
	return pro.isCaptain ? "captainFree" : "memberFree";
};

export const dayMonth = (iso: string | null): string => {
	if (!iso) return "";
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const savingsOf = (
	plans: readonly { period: string; priceValue: number }[],
): string | null => {
	const monthly = plans.find((p) => p.period === "monthly");
	const annual = plans.find((p) => p.period === "annual");
	if (!monthly || !annual || monthly.priceValue <= 0) return null;
	const pct = Math.round((1 - annual.priceValue / (monthly.priceValue * 12)) * 100);
	return pct > 0 ? `${String(pct)}%` : null;
};
