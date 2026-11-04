import React from "react";
import { Text, View } from "react-native";

import { Avatar, GlassCard } from "@/components/pace";
import { useTheme } from "@/theme";

import { RUN_SUMMARY_COPY } from "../../constants";
import { ITeamMateRow } from "../../hooks/useTeamRunSource";

import { createTeamMatesCardStyles } from "./styles";

interface ITeamMatesCardProps {
	people: ITeamMateRow[];
}

// Corrida em grupo: a foto, a distância, o tempo e o ritmo de cada um
export const TeamMatesCard: React.FC<ITeamMatesCardProps> = ({ people }) => {
	const { theme } = useTheme();
	const styles = createTeamMatesCardStyles(theme);

	return (
		<GlassCard>
			<Text style={styles.title}>{RUN_SUMMARY_COPY.whoRan}</Text>
			{people.map((p, i) => (
				<View key={p.key} style={[styles.row, i > 0 ? styles.divider : null]}>
					<Avatar name={p.name} src={p.photo ?? undefined} size={40} ring={p.isYou} />
					<View style={styles.body}>
						<Text style={styles.name}>{p.name}</Text>
						<View style={styles.numbers}>
							<Text style={styles.number}>
								{p.distance}
								<Text style={styles.label}>{` ${RUN_SUMMARY_COPY.inTime} `}</Text>
								{p.time}
							</Text>
							<Text style={styles.number}>
								{p.pace}
								<Text style={styles.label}>{" min/km"}</Text>
							</Text>
						</View>
					</View>
				</View>
			))}
		</GlassCard>
	);
};
