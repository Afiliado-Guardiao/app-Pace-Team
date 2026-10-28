import React from "react";
import { Text, View } from "react-native";

import { Avatar, AvatarStack, CountUp, GlassCard, InfoNote } from "@/components/pace";
import { SpringBar } from "@/components/shared/SpringBar";
import { useTheme } from "@/theme";

import { RUN_SUMMARY_COPY } from "../../constants";
import { useGroupRun } from "../../hooks/useGroupRun";

import { createGroupRunStyles } from "./styles";

const STAGGER = 80;
const BASE_DELAY = 300;

// Detalhe da corrida da equipe: total, pontos e a contribuição de cada um.
export const GroupRunDetail: React.FC = () => {
	const { theme } = useTheme();
	const styles = createGroupRunStyles(theme);
	const group = useGroupRun();

	return (
		<View style={styles.stack}>
			<View>
				<Text style={styles.meta}>{group.meta}</Text>
				<Text style={styles.title}>{RUN_SUMMARY_COPY.groupTitle}</Text>
			</View>
			<GlassCard variant="accent">
				<View style={styles.between}>
					<AvatarStack people={group.people} max={5} size={34} />
					<Text style={styles.ran}>{group.ran}</Text>
				</View>
				<View style={styles.totals}>
					<View>
						<Text style={styles.small}>{RUN_SUMMARY_COPY.groupDistance}</Text>
						<Text style={styles.total}>
							<CountUp value={group.totalKm} delay={150} />
							<Text style={styles.totalUnit}> km</Text>
						</Text>
					</View>
					<View style={styles.right}>
						<Text style={styles.small}>{RUN_SUMMARY_COPY.points}</Text>
						<Text style={styles.points}>
							<CountUp value={group.totalPoints} delay={250} />
						</Text>
					</View>
				</View>
			</GlassCard>
			<GlassCard>
				<View style={styles.membersHeader}>
					<Text style={styles.membersTitle}>{RUN_SUMMARY_COPY.members}</Text>
					<Text style={styles.hint}>{RUN_SUMMARY_COPY.membersHint}</Text>
				</View>
				{group.members.map((m, i) => (
					<View
						key={`${m.name}-${String(i)}`}
						style={[styles.member, i > 0 ? styles.memberDivider : null]}
					>
						<Avatar name={m.name} src={m.avatarUrl ?? undefined} size={38} ring={m.isYou} />
						<View style={styles.memberBody}>
							<View style={styles.between}>
								<Text style={styles.name}>{m.isYou ? RUN_SUMMARY_COPY.you : m.name}</Text>
								<Text style={styles.km}>
									<CountUp
										value={group.distances[i]?.value ?? "0"}
										delay={BASE_DELAY + i * STAGGER}
									/>
									<Text style={styles.unit}>{` ${group.distances[i]?.unit ?? "km"}`}</Text>
								</Text>
							</View>
							<View style={styles.barRow}>
								<View style={styles.bar}>
									<SpringBar
										progress={m.km / group.maxKm}
										height={6}
										delay={BASE_DELAY + i * STAGGER}
										tone={m.isYou ? "progress" : "soft"}
										trackColor={theme.pace.colors.barSoft}
									/>
								</View>
								<Text style={styles.pace}>{m.pace}</Text>
							</View>
						</View>
					</View>
				))}
			</GlassCard>
			<InfoNote>{RUN_SUMMARY_COPY.groupNote}</InfoNote>
		</View>
	);
};
