import { useMemo, useState } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { IFloatingToastData } from "@/components/pace";
import { ITeamView, teamErrorMessage, useAthleteSearch, useTeamActions } from "@/lib/data";
import { IAthleteResult, ITeamInviteRow } from "@/lib/supabase";
import { IS_PREVIEW } from "@/constants/preview";

import { INVITE_SHARE } from "../constants";

const WHATSAPP_APP = "whatsapp://send?text=";
const WHATSAPP_WEB = "https://wa.me/?text=";
const MAX_SUGGESTIONS = 3;
const MIN_QUERY = 2;

// 06 · convites dentro do onboarding: código, link, WhatsApp, busca de
// atletas (3 sugestões) e a lista de quem entrou ou foi convidado
export const useStepInvites = (
	team: ITeamView | null,
	showToast: (t: IFloatingToastData) => void,
) => {
	// Convidados nesta tela (aparecem na hora, antes do servidor responder)
	const [sent, setSent] = useState<ITeamInviteRow[]>([]);
	const { invite } = useTeamActions();
	const [query, setQuery] = useState("");
	const { athletes } = useAthleteSearch(query);
	const invites = useMemo(() => {
		const server = team?.invites ?? [];
		const extra = sent.filter((x) => !server.some((i) => i.name === x.name));
		return [...server, ...extra];
	}, [team?.invites, sent]);
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
		// Só depois que o atleta digita: a busca é por nome ou @ de gente real
		if (query.trim().length < MIN_QUERY) return [];
		return athletes.filter((a) => !taken.has(a.name)).slice(0, MAX_SUGGESTIONS);
	}, [athletes, invites, team?.members, query]);

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
		// Na prévia por link não há atletas de verdade para achar
		suggestions: IS_PREVIEW ? [] : suggestions,
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
					setSent((list) => [...list, { id: athlete.id, name: athlete.name, status: "pending" }]);
					showToast({ tone: "success", title: INVITE_SHARE.sent, message: athlete.name });
				},
				onError: (error) => {
					showToast({ tone: "danger", title: INVITE_SHARE.sent, message: teamErrorMessage(error) });
				},
			});
		},
	};
};
