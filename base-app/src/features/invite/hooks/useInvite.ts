import { useCallback, useMemo, useState } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

import { useFloatingToast } from "@/components/pace";
import { teamErrorMessage, useAthleteSearch, useMyTeam, useTeamActions } from "@/lib/data";
import { IAthleteResult } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { INVITE_COPY, INVITE_LINK_BASE } from "../constants";

const WHATSAPP_APP = "whatsapp://send?text=";
const WHATSAPP_WEB = "https://wa.me/?text=";

// 11 Convidar: vagas, código/WhatsApp, busca de atletas e convites enviados.
export const useInvite = () => {
	const router = useRouter();
	const { team } = useMyTeam();
	const { invite: inviteMutation } = useTeamActions();
	const { toast, showToast } = useFloatingToast();
	const [query, setQuery] = useState("");
	const { athletes } = useAthleteSearch(query);
	const invites = team?.invites ?? [];
	const pending = invites.filter((i) => i.status === "pending").length;
	const used = (team?.members.length ?? 0) + pending;
	const left = Math.max(0, (team?.size ?? 0) - used);
	const code = team?.inviteCode ?? "";
	const shareText = `${INVITE_COPY.shareA}${team?.name ?? ""}${INVITE_COPY.shareB}${code} (${INVITE_LINK_BASE}${code})`;

	// Sem quem já foi convidado ou já está no time
	const suggestions = useMemo(() => {
		const taken = new Set([
			...invites.map((i) => i.name),
			...(team?.members ?? []).map((m) => m.name),
		]);
		return athletes.filter((a) => !taken.has(a.name));
	}, [athletes, invites, team?.members]);

	const invite = useCallback(
		(athlete: IAthleteResult) => {
			if (left <= 0) return;
			inviteMutation.mutate(athlete.id, {
				onSuccess: () => {
					showToast({
						tone: "success",
						title: INVITE_COPY.sentTitle,
						message: `${athlete.name}${INVITE_COPY.sentMessage}`,
					});
				},
				onError: (error) => {
					showToast({
						tone: "danger",
						title: INVITE_COPY.errorTitle,
						message: teamErrorMessage(error),
					});
				},
			});
		},
		[left, inviteMutation, showToast],
	);

	const copyLink = useCallback(async () => {
		const isCopied = await Clipboard.setStringAsync(shareText).catch(() => false);
		if (!isCopied) return;
		showToast({
			tone: "success",
			icon: "link",
			title: INVITE_COPY.copiedTitle,
			message: INVITE_COPY.copiedMessage,
		});
	}, [shareText, showToast]);

	const openWhatsApp = useCallback(async () => {
		const text = encodeURIComponent(shareText);
		const hasApp = await Linking.canOpenURL(`${WHATSAPP_APP}${text}`).catch(() => false);
		await Linking.openURL(`${hasApp ? WHATSAPP_APP : WHATSAPP_WEB}${text}`).catch(() => undefined);
	}, [shareText]);

	return {
		toast,
		team,
		title: team ? `${team.name} · ${team.category}` : "",
		code,
		invites,
		used,
		left,
		query,
		setQuery,
		suggestions,
		invite,
		copyLink: () => {
			void copyLink();
		},
		openWhatsApp: () => {
			void openWhatsApp();
		},
		openCreate: () => {
			router.replace(ROUTES.CREATE_TEAM);
		},
		goBack: () => {
			if (router.canGoBack()) router.back();
			else router.navigate(ROUTES.TEAM);
		},
	};
};
