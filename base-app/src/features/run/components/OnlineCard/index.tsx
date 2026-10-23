import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Badge, GlassSurface, useEntrance } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ONLINE } from "@/lib/pace";

import { RUN_COPY } from "../../constants";

const PHOTO = 34;
const ONLINE_DOT = 9;
const OVERLAP = -10;

const createOnlineCardStyles = (theme: ITheme) => {
	const { blur, colors, spacing, typography } = theme.pace;
	return {
		card: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: spacing[3],
			paddingVertical: 10,
			paddingHorizontal: spacing[3.5],
		},
		appearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		photos: { flexDirection: "row" as const },
		photoWrap: { marginLeft: OVERLAP },
		first: { marginLeft: 0 },
		photo: {
			width: PHOTO,
			height: PHOTO,
			borderRadius: PHOTO / 2,
			boxShadow: `0 0 0 2px ${colors.slate[800]}`,
		},
		dot: {
			position: "absolute" as const,
			right: 0,
			bottom: 0,
			width: ONLINE_DOT,
			height: ONLINE_DOT,
			borderRadius: ONLINE_DOT / 2,
			backgroundColor: colors.statusSuccess,
			boxShadow: `0 0 0 2px ${colors.slate[800]}`,
		},
		texts: { flex: 1 },
		title: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.sm,
			color: colors.textPrimary,
		},
		sub: {
			marginTop: 2,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
		},
	};
};

// "Correr junto": quem do time está online e compartilhando ao vivo.
export const OnlineCard: React.FC = () => {
	const { theme } = useTheme();
	const styles = createOnlineCardStyles(theme);
	const entrance = useEntrance("rise", { duration: 500 });

	return (
		<Animated.View style={entrance}>
			<GlassSurface
				appearance={styles.appearance}
				radius={theme.pace.radii.row}
				style={styles.card}
			>
				<View style={styles.photos}>
					{ONLINE.map((friend, index) => (
						<View key={friend.name} style={[styles.photoWrap, index === 0 ? styles.first : null]}>
							<Image source={friend.image} style={styles.photo} />
							<View style={styles.dot} />
						</View>
					))}
				</View>
				<View style={styles.texts}>
					<Text style={styles.title}>{RUN_COPY.onlineTitle}</Text>
					<Text style={styles.sub}>{RUN_COPY.onlineSub}</Text>
				</View>
				<Badge tone="success" dot>
					{RUN_COPY.ready}
				</Badge>
			</GlassSurface>
		</Animated.View>
	);
};
