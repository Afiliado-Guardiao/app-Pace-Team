import { useCallback, useState } from "react";

import { useRouter } from "expo-router";

import { IFloatingToastData, useFloatingToast } from "@/components/pace";
import { ITeamView, teamErrorMessage, useMyInvites, useMyTeam, useTeamActions } from "@/lib/data";
import { IMyInvite } from "@/lib/supabase";
import { ROUTES } from "@/constants/routes";

import { TEAM_COPY } from "../constants";

interface IUseTeamScreenReturn {
	team: ITeamView | null;
	isLoading: boolean;
	invite: IMyInvite | null;
	toast: IFloatingToastData | null;
	isBusy: boolean;
	isLeaveOpen: boolean;
	isJoinOpen: boolean;
	joinCode: string;
	setJoinCode: (code: string) => void;
	openDetails: () => void;
	openInvite: () => void;
	openRanking: () => void;
	openCreate: () => void;
	openLeave: () => void;
	closeLeave: () => void;
	confirmLeave: () => void;
	openJoin: () => void;
	closeJoin: () => void;
	confirmJoin: () => void;
	acceptInvite: () => void;
	declineInvite: () => void;
}

// 09 Equipe: com time (capa, números, pódio, integrantes) ou sem time.
export const useTeamScreen = (): IUseTeamScreenReturn => {
	const router = useRouter();
	const { team, isLoading } = useMyTeam();
	const { invites } = useMyInvites();
	const actions = useTeamActions();
	const { toast, showToast } = useFloatingToast();
	const [isLeaveOpen, setIsLeaveOpen] = useState(false);
	const [isJoinOpen, setIsJoinOpen] = useState(false);
	const [joinCode, setJoinCode] = useState("");
	const invite = invites.at(0) ?? null;

	const fail = useCallback(
		(error: unknown) => {
			showToast({ tone: "danger", title: TEAM_COPY.errorTitle, message: teamErrorMessage(error) });
		},
		[showToast],
	);

	const respond = useCallback(
		(accept: boolean) => {
			if (!invite) return;
			actions.respond.mutate({ inviteId: invite.id, accept }, { onError: fail });
		},
		[actions.respond, invite, fail],
	);

	return {
		team,
		isLoading,
		invite,
		toast,
		isBusy: actions.leave.isPending || actions.joinByCode.isPending || actions.respond.isPending,
		isLeaveOpen,
		isJoinOpen,
		joinCode,
		setJoinCode,
		openDetails: () => {
			router.push(ROUTES.TEAM_DETAILS);
		},
		openInvite: () => {
			router.push(ROUTES.INVITE);
		},
		openRanking: () => {
			router.navigate(ROUTES.RANKING);
		},
		openCreate: () => {
			router.push(ROUTES.CREATE_TEAM);
		},
		openLeave: () => {
			setIsLeaveOpen(true);
		},
		closeLeave: () => {
			setIsLeaveOpen(false);
		},
		confirmLeave: () => {
			setIsLeaveOpen(false);
			actions.leave.mutate(undefined, { onError: fail });
		},
		openJoin: () => {
			setIsJoinOpen(true);
		},
		closeJoin: () => {
			setIsJoinOpen(false);
		},
		confirmJoin: () => {
			if (!joinCode.trim()) return;
			actions.joinByCode.mutate(joinCode, {
				onSuccess: () => {
					setIsJoinOpen(false);
					setJoinCode("");
				},
				onError: fail,
			});
		},
		acceptInvite: () => {
			respond(true);
		},
		declineInvite: () => {
			respond(false);
		},
	};
};

export type IUseTeamScreen = IUseTeamScreenReturn;
