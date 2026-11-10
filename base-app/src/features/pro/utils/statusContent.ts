import { IMyPro } from "@/lib/supabase";

import { PRO_STATUS_COPY as C } from "../constants";

import { dayMonth, IProStateKind } from "./proState";

export interface IProStatusContent {
	icon: string;
	title: string;
	body: string;
	cta: string | null;
	isGold: boolean;
}

const coveredBody = (pro: IMyPro): string => {
	const who = pro.isPayer ? C.youPay : `${C.paidBy}${pro.payerName ?? ""}.`;
	const until = pro.endsAt ? ` ${C.until}${dayMonth(pro.endsAt)}.` : "";
	return `${String(pro.covered)}${C.covered}. ${who}${until}`;
};

const linkBody = (pro: IMyPro): string =>
	pro.ownSubTeamName
		? `${C.linkBodyOther}${pro.ownSubTeamName}${C.linkBodyOtherEnd}`
		: C.linkBodyFree;

// Texto do cartão de status para cada situação (null = sem cartão)
export const statusContent = (
	kind: IProStateKind,
	pro: IMyPro | null,
): IProStatusContent | null => {
	if (!pro) return null;
	switch (kind) {
		case "noTeam":
			return {
				icon: "users",
				title: C.noTeamTitle,
				body: C.noTeamBody,
				cta: C.noTeamCta,
				isGold: false,
			};
		case "covered":
			return {
				icon: "crown",
				title: `${pro.teamName ?? ""}${C.proTitle}`,
				body: coveredBody(pro),
				cta: pro.isPayer ? C.manage : null,
				isGold: true,
			};
		case "overLimit":
			return { icon: "crown", title: C.overTitle, body: C.overBody, cta: null, isGold: true };
		case "memberFree":
			return {
				icon: "flag",
				title: C.memberTitle,
				body: C.memberBody,
				cta: C.memberCta,
				isGold: false,
			};
		case "canLink":
			return {
				icon: "link",
				title: C.linkTitle,
				body: linkBody(pro),
				cta: C.linkCta,
				isGold: true,
			};
		default:
			return null;
	}
};
