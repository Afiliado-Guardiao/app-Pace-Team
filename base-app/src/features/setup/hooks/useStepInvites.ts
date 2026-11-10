import { useMemo, useState } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { IFloatingToastData } from "@/components/pace";
import { teamErrorMessage, useAthleteSearch, useMyTeam, useTeamActions } from "@/lib/data";
import { IAthleteResult } from "@/lib/supabase";

import { INVITE_SHARE } from "../constants";

const WHATSAPP_APP = "whatsapp://send?text=";
const WHATSAPP_WEB = "https://wa.me/?text=";
const MAX_SUGGESTIONS = 3;

// 06 · convites dentro do onboarding: código, link, WhatsApp, busca de
// atletas (3 sugestões) e a lista de quem entrou ou foi convidado
export const useStepInvites = (showToast: (t: IFloatingToastData) => void) => {
	const { team } = useMyTeam();
	const { invite } = useTeamActions();
	const [query, setQuery] = useState("");
	const { athletes } = useAthleteSearch(query);
	const invites = useMemo(() => team?.invites ?? [], [team?.invites]);
	const pending = invites.filter((i) => i.status === "pending");
	const used = (team?.members.length ?? 0) + pending.length;
	const left = Math.max(0, (team?.size ?? 10) - used);
	const code = team?.inviteCode ?? "";
	const shareText = `${INVITE_SHARE.a}${team?.name ?? ""}${INVITE_SHARE.b}${code} (${INVITE_SHARE.link}${code})`;

	const suggestions = useMemo(() => {
		const taken = new Set([
			...invites.map((i) => i.name),
			...(team?.members ?? []).map((m) => m.name),
		]);
		return athletes.filter((a) => !taken.has(a.name)).slice(0, MAX_SUGGESTIONS);
	}, [athletes, invites, team?.members]);

	const copy = (text: string) => {
		void Clipboard.setStringAsync(text)
			.then(() => {
				showToast({ tone: "success", icon: "check", title: INVITE_SHARE.copied });
			})
			.catch(() => undefined);
	};

	return {
		code,
		left,
		used,
		pending,
		query,
		setQuery,
		suggestions,
		isFull: left <= 0,
		copyCode: () => {
			copy(code);
		},
		copyLink: () => {
			copy(shareText);
		},
		openWhatsApp: () => {
			const text = encodeURIComponent(shareText);
			void Linking.canOpenURL(`${WHATSAPP_APP}${text}`)
				.catch(() => false)
				.then((hasApp) => Linking.openURL(`${hasApp ? WHATSAPP_APP : WHATSAPP_WEB}${text}`))
				.catch(() => undefined);
		},
		invite: (athlete: IAthleteResult) => {
			if (left <= 0) return;
			invite.mutate(athlete.id, {
				onSuccess: () => {
					showToast({ tone: "success", title: INVITE_SHARE.sent, message: athlete.name });
				},
				onError: (error) => {
					showToast({ tone: "danger", title: INVITE_SHARE.sent, message: teamErrorMessage(error) });
				},
			});
		},
	};
};
