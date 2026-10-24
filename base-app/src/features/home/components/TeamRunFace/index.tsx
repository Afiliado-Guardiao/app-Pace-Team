import React from "react";
import { Text, View } from "react-native";

import { CountUp, GlassCard, GlassSurface, Icon, IconButton } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { HOME_COPY, STACK } from "../../constants";
import { ITeamRunFaceData } from "../../hooks/useHomeFaces";

const ICON_DOT = 40;
const BIG = 38;
const KM_TOP = 58;
const COUNT_DELAY = 300;

const createTeamRunFaceStyles = (theme: ITheme) => {
	const { blur, colors, spacing, typography } = theme.pace;
	const { fonts, sizes, lineHeights } = typography;
	return {
		card: { height: STACK.height },
		header: {
			flexDirection: "row" as const,
			justifyContent: "space-between" as const,
			alignItems: "flex-start" as const,
		},
		lead: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			flexShrink: 1,
		},
		iconDot: {
			width: ICON_DOT,
			height: ICON_DOT,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		iconAppearance: {
			fill: { color: colors.surfaceTabIdle },
			blur: blur.intensity.glass,
			border: colors.glassBorderStrong,
			rim: true,
		},
		title: {
			fontFamily: fonts.bold,
			fontSize: sizes.md,
			lineHeight: sizes.md * lineHeights.snug,
			color: colors.textPrimary,
		},
		sub: { fontFamily: fonts.medium, fontSize: sizes.sm, color: colors.textSecondary },
		km: {
			marginTop: KM_TOP,
			fontFamily: fonts.bold,
			fontSize: BIG,
			fontVariant: [...typography.tabularNums],
			color: colors.textPrimary,
		},
		unit: { fontFamily: fonts.medium, fontSize: sizes.ui, color: colors.textSecondary },
	};
};

// Face "Última corrida da equipe": foto da pista, distância e atalho.
export const TeamRunFace: React.FC<{ data: ITeamRunFaceData }> = ({ data }) => {
	const { theme } = useTheme();
	const styles = createTeamRunFaceStyles(theme);

	return (
		<GlassCard image={PHOTOS.teamTrack} radius={theme.pace.radii.hero} style={styles.card}>
			<View style={styles.header}>
				<View style={styles.lead}>
					<GlassSurface
						appearance={styles.iconAppearance}
						radius={ICON_DOT / 2}
						style={styles.iconDot}
					>
						<Icon name="footprints" size={17} />
					</GlassSurface>
					<View>
						<Text style={styles.title}>{HOME_COPY.lastRunTitle}</Text>
						<Text style={styles.sub} numberOfLines={1}>
							{data.sub}
						</Text>
					</View>
				</View>
				<IconButton icon="arrow-up-right" label="Abrir corrida" variant="light" size={44} />
			</View>
			<Text style={styles.km}>
				<CountUp value={data.km} delay={COUNT_DELAY} />
				<Text style={styles.unit}> km</Text>
			</Text>
		</GlassCard>
	);
};
