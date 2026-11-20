import React from "react";
import { Text, View } from "react-native";

import { Avatar } from "@/components/pace";
import { useTheme } from "@/theme";

import { IPresencePerson, ITeamPresence } from "../../hooks/useTeamPresence";

import { createTeamPresenceStyles } from "./styles";

interface ITeamPresenceProps {
	presence: ITeamPresence;
	// Largura disponível (cabe todo mundo numa fileira só)
	width: number;
}

const COPY = {
	online: (n: number) => `${String(n)} online`,
	offline: (n: number) => `${String(n)} fora`,
	you: "Você",
} as const;

const Person: React.FC<{ person: IPresencePerson; size: number; itemW: number }> = ({
	person,
	size,
	itemW,
}) => {
	const { theme } = useTheme();
	const styles = createTeamPresenceStyles(theme, { size, itemW, isOnline: person.isOnline });
	return (
		<View
			style={styles.person}
			accessibilityLabel={`${person.name}, ${person.isOnline ? "online" : "fora"}`}
		>
			<View style={styles.photo}>
				<Avatar src={person.avatarUrl} name={person.name} size={size} />
				{person.isOnline ? <View style={styles.dot} /> : null}
			</View>
			<Text style={styles.name} numberOfLines={2}>
				{person.isMe ? COPY.you : person.name}
			</Text>
		</View>
	);
};

// Embaixo da pista do Buddy: à esquerda quem da equipe está online (foto
// redonda, bolinha verde e o nome inteiro), à direita quem está fora
export const TeamPresence: React.FC<ITeamPresenceProps> = ({ presence, width }) => {
	const { theme } = useTheme();
	const count = Math.max(1, presence.people.length);
	const itemW = Math.min(64, Math.max(44, (width - 14) / count));
	const size = Math.min(38, itemW - 12);
	const styles = createTeamPresenceStyles(theme, { size, itemW, isOnline: true });
	const online = presence.people.filter((p) => p.isOnline);
	const offline = presence.people.filter((p) => !p.isOnline);

	return (
		<View style={styles.root} testID="home-team-presence">
			<View style={styles.header}>
				<View style={styles.headerDot} />
				<Text style={styles.headerText}>{COPY.online(online.length)}</Text>
				{offline.length > 0 ? (
					<Text style={styles.headerMuted}>{` · ${COPY.offline(offline.length)}`}</Text>
				) : null}
			</View>
			<View style={styles.row}>
				{online.map((p) => (
					<Person key={p.id} person={p} size={size} itemW={itemW} />
				))}
				{offline.length > 0 && online.length > 0 ? <View style={styles.divider} /> : null}
				{offline.map((p) => (
					<Person key={p.id} person={p} size={size} itemW={itemW} />
				))}
			</View>
		</View>
	);
};
