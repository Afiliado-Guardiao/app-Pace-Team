import React from "react";
import { Image, Text, View } from "react-native";

import Animated from "react-native-reanimated";

import { Avatar, Badge, GlassSurface, useEntrance } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";
import { ITeamOnlineView } from "@/lib/data";

import { RUN_COPY } from "../../constants";

const PHOTO = 34;
const ONLINE_DOT = 9;
const OVERLAP = -10;
const MAX_PHOTOS = 4;

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

interface IOnlineCardProps {
	mates: ITeamOnlineView[];
	title: string;
	sub: string;
	isReady: boolean;
}

// "Correr junto": quem do time está com o app aberto agora.
export const OnlineCard: React.FC<IOnlineCardProps> = ({ mates, title, sub, isReady }) => {
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
					{mates.slice(0, MAX_PHOTOS).map((friend, index) => (
						<View key={friend.id} style={[styles.photoWrap, index === 0 ? styles.first : null]}>
							{friend.image ? (
								<Image source={friend.image} style={styles.photo} />
							) : (
								<Avatar name={friend.name} size={PHOTO} />
							)}
							<View style={styles.dot} />
						</View>
					))}
				</View>
				<View style={styles.texts}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.sub}>{sub}</Text>
				</View>
				{isReady ? (
					<Badge tone="success" dot>
						{RUN_COPY.ready}
					</Badge>
				) : null}
			</GlassSurface>
		</Animated.View>
	);
};
