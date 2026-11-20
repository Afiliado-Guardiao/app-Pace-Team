import React from "react";
import { Text, View, ViewStyle } from "react-native";

import { Avatar } from "@/components/pace";
import { useTheme } from "@/theme";

import { PANEL_COPY } from "../copy";
import { IPanelData } from "../hooks/usePanelData";

import { PanelButton } from "./PanelButton";
import { createSectionStyles } from "./styles";

interface ITeamSectionProps {
	team: IPanelData["team"];
	k: number;
	onOpen: () => void;
	onInvite: () => void;
}

const EMBLEM = 76;
const FACE = 42;

// Equipe: escudo, quem está online, km e pontos da equipe
export const TeamSection: React.FC<ITeamSectionProps> = ({ team, k, onOpen, onInvite }) => {
	const { theme } = useTheme();
	const s = createSectionStyles(theme, k);
	const dot: ViewStyle = {
		...s.dotOnline,
		position: "absolute",
		right: 0,
		bottom: 14 * k,
		borderWidth: 1.5,
		borderColor: "#000",
	};

	if (!team) {
		return (
			<View style={[s.root, s.center, { gap: 14 * k }]}>
				<Text style={s.title}>{PANEL_COPY.team.noTeam}</Text>
				<PanelButton
					label={PANEL_COPY.team.create}
					onPress={onOpen}
					isPrimary
					testID="home-panel-team"
				/>
			</View>
		);
	}

	return (
		<View style={[s.root, { justifyContent: "center", gap: 14 * k }]}>
			<View style={s.row}>
				<Avatar src={team.logoUrl ?? undefined} name={team.name} size={EMBLEM * k} square />
				<View style={{ flex: 1, gap: 2 }}>
					<Text style={[s.title, { textAlign: "left" }]} numberOfLines={1}>
						{team.name}
					</Text>
					<Text style={s.small}>{team.place}</Text>
				</View>
			</View>
			<View style={[s.row, { justifyContent: "space-between" }]}>
				{team.members.map((m) => (
					<View key={m.name} style={{ alignItems: "center", gap: 4 }}>
						<Avatar src={m.avatarUrl} name={m.name} size={FACE * k} />
						{m.isOnline ? <View style={dot} /> : null}
						<Text style={s.small} numberOfLines={1}>
							{m.name}
						</Text>
					</View>
				))}
			</View>
			<View style={s.row}>
				<View style={s.glassBox}>
					<Text style={s.small}>{PANEL_COPY.team.km}</Text>
					<Text style={[s.number, { fontSize: 18 * k, textShadowRadius: 0 }]}>{team.km}</Text>
				</View>
				<View style={s.glassBox}>
					<Text style={s.small}>{PANEL_COPY.team.points}</Text>
					<Text style={[s.number, { fontSize: 18 * k, textShadowRadius: 0 }]}>{team.points}</Text>
				</View>
			</View>
			<View style={[s.row, { justifyContent: "center" }]}>
				<PanelButton label={PANEL_COPY.team.invite} onPress={onInvite} testID="home-panel-invite" />
				<PanelButton label={PANEL_COPY.team.action} onPress={onOpen} testID="home-panel-team" />
			</View>
		</View>
	);
};
