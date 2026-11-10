import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY } from "../../constants";
import { TEAM_EMBLEMS } from "../../constants/emblems";
import { useLogoPicker } from "../../hooks/useLogoPicker";

interface IEmblemPickerProps {
	logo: ReturnType<typeof useLogoPicker>;
	// Logo atual (emblema, foto nova ou o escudo salvo da equipe)
	uri: string | null;
}

const BIG = 92;
const CELL = 58;
const PEN = 26;

const createEmblemPickerStyles = (theme: ITheme) => {
	const { colors, spacing, typography } = theme.pace;
	const cell = { width: CELL, height: CELL, borderRadius: 16 };
	return {
		root: { flexDirection: "row" as const, alignItems: "center" as const, gap: spacing[4] },
		big: {
			width: BIG,
			height: BIG,
			borderRadius: 28,
			borderWidth: 2,
			borderColor: colors.accent,
			overflow: "hidden" as const,
			backgroundColor: colors.glass1,
		},
		bigImage: { width: BIG, height: BIG },
		pen: {
			position: "absolute" as const,
			right: -6,
			bottom: -6,
			width: PEN,
			height: PEN,
			borderRadius: PEN / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accent,
		},
		side: { flex: 1, gap: spacing[2] },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		grid: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: spacing[2] },
		cell: { ...cell, borderWidth: 2, borderColor: colors.glassBorder, overflow: "hidden" as const },
		cellOn: { borderColor: colors.accent },
		image: cell,
		action: {
			...cell,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			gap: 2,
			borderWidth: 1.5,
			borderStyle: "dashed" as const,
			borderColor: colors.glassBorderStrong,
		},
		actionText: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.micro,
			color: colors.textSecondary,
		},
		white: colors.onAccent,
	};
};

// Emblema grande (com lápis) e a grade: Raposa, Leão, Lobo, Falcão, Foto e Galeria
export const EmblemPicker: React.FC<IEmblemPickerProps> = ({ logo, uri }) => {
	const { theme } = useTheme();
	const styles = createEmblemPickerStyles(theme);

	return (
		<View style={styles.root}>
			<View>
				<View style={styles.big}>
					{uri ? <Image source={{ uri }} style={styles.bigImage} /> : null}
				</View>
				<View style={styles.pen}>
					<Icon name="pencil" size={14} color={styles.white} />
				</View>
			</View>
			<View style={styles.side}>
				<Text style={styles.label}>{CREATE_TEAM_COPY.logoEmblems}</Text>
				<View style={styles.grid}>
					{TEAM_EMBLEMS.map((item) => (
						<Pressable
							key={item.id}
							onPress={() => {
								logo.pickEmblem(item.id);
							}}
							style={[styles.cell, logo.emblem === item.id ? styles.cellOn : null]}
							accessibilityRole="button"
							accessibilityLabel={item.name}
							testID={`create-team-emblem-${item.id}`}
						>
							<Image source={item.source} style={styles.image} />
						</Pressable>
					))}
					<Pressable
						onPress={logo.pickCamera}
						style={styles.action}
						accessibilityRole="button"
						accessibilityLabel={CREATE_TEAM_COPY.logoCamera}
						testID="create-team-logo-camera"
					>
						<Icon name="camera" size={18} />
						<Text style={styles.actionText}>{CREATE_TEAM_COPY.logoCamera}</Text>
					</Pressable>
					<Pressable
						onPress={logo.pickGallery}
						style={styles.action}
						accessibilityRole="button"
						accessibilityLabel={CREATE_TEAM_COPY.logoGallery}
						testID="create-team-logo-gallery"
					>
						<Icon name="image-plus" size={18} />
						<Text style={styles.actionText}>{CREATE_TEAM_COPY.logoGallery}</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
};
