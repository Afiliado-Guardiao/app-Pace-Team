import React from "react";
import { View } from "react-native";

import {
	Badge,
	Button,
	FloatingToast,
	InfoNote,
	Input,
	Label,
	ListRow,
	ScreenBackground,
	ScreenScroll,
	TopBar,
} from "@/components/pace";
import { PHOTOS } from "@/lib/pace";

import { InviteCard } from "./components/InviteCard";
import { INVITE_COPY } from "./constants";
import { useInvite } from "./hooks/useInvite";

const ROOT = { flex: 1 } as const;
const LABEL_GAP = { marginTop: 6 } as const;

// 11 Convidar amigos: vagas, código, busca de atletas e status dos convites.
export const InviteScreen: React.FC = () => {
	const invite = useInvite();
	const hasRoom = invite.left > 0;

	return (
		<View style={ROOT}>
			<ScreenBackground photo={PHOTOS.teamRunningSunset} />
			<ScreenScroll bottom={40}>
				<TopBar title={INVITE_COPY.title} onBack={invite.goBack} />
				{invite.team ? (
					<InviteCard
						title={invite.title}
						code={invite.code}
						capacity={invite.team.size}
						used={invite.used}
						left={invite.left}
						onCopyLink={invite.copyLink}
						onWhatsApp={invite.openWhatsApp}
					/>
				) : (
					<Button fullWidth icon="plus" onPress={invite.openCreate} testID="invite-create-team">
						{INVITE_COPY.noTeamTitle}
					</Button>
				)}
				<Input
					icon="search"
					placeholder={INVITE_COPY.search}
					value={invite.query}
					onChangeText={invite.setQuery}
					accessibilityLabel={INVITE_COPY.search}
					testID="invite-search"
				/>
				<Label>{INVITE_COPY.suggestions}</Label>
				{invite.suggestions.length ? null : <InfoNote icon="search">{INVITE_COPY.nobody}</InfoNote>}
				{invite.suggestions.map((p) => {
					const canInvite = hasRoom && Boolean(invite.team) && !p.hasTeam;
					return (
						<ListRow
							key={p.id}
							title={p.name}
							sub={p.hasTeam ? INVITE_COPY.inTeam : p.handle}
							right={
								<Button
									size="sm"
									variant={canInvite ? "outline" : "ghost"}
									disabled={!canInvite}
									icon="user-plus"
									onPress={() => {
										invite.invite(p);
									}}
									testID={`invite-${p.id}`}
								>
									{hasRoom ? INVITE_COPY.invite : INVITE_COPY.isFull}
								</Button>
							}
						/>
					);
				})}
				{invite.invites.length ? <Label style={LABEL_GAP}>{INVITE_COPY.invites}</Label> : null}
				{invite.invites.map((p) => (
					<ListRow
						key={p.id}
						title={p.name}
						sub={p.status === "accepted" ? INVITE_COPY.joined : INVITE_COPY.waiting}
						right={
							p.status === "accepted" ? (
								<Badge tone="success" dot>
									{INVITE_COPY.accepted}
								</Badge>
							) : (
								<Badge tone="warning" dot>
									{INVITE_COPY.pending}
								</Badge>
							)
						}
					/>
				))}
			</ScreenScroll>
			<FloatingToast toast={invite.toast} />
		</View>
	);
};
