import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Button, Sheet } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { CREATE_TEAM_COPY } from "../../constants";
import { TEAM_EMBLEMS } from "../../constants/emblems";
import { useLogoPicker } from "../../hooks/useLogoPicker";

interface ILogoSheetProps {
	logo: ReturnType<typeof useLogoPicker>;
}

const CELL = 72;

const createLogoSheetStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		body: { gap: spacing[3] },
		hint: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.sm,
			color: colors.textSecondary,
		},
		grid: { flexDirection: "row" as const, justifyContent: "space-between" as const },
		cell: { alignItems: "center" as const, gap: spacing[1] },
		image: { width: CELL, height: CELL, borderRadius: radii.lg, borderWidth: 2 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textPrimary,
		},
		idle: colors.glassBorder,
		active: colors.orange[500],
	};
};

// Folha do "Logo": emblemas prontos (raposa, leão, lobo, falcão) ou galeria
export const LogoSheet: React.FC<ILogoSheetProps> = ({ logo }) => {
	const { theme } = useTheme();
	const styles = createLogoSheetStyles(theme);

	return (
		<Sheet
			open={logo.isOpen}
			title={CREATE_TEAM_COPY.logoSheetTitle}
			onClose={logo.close}
			actions={
				<Button
					fullWidth
					variant="glass"
					icon="image-plus"
					onPress={logo.pickGallery}
					testID="create-team-logo-gallery"
				>
					{CREATE_TEAM_COPY.logoGallery}
				</Button>
			}
		>
			<View style={styles.body}>
				<Text style={styles.hint}>{CREATE_TEAM_COPY.logoEmblems}</Text>
				<View style={styles.grid}>
					{TEAM_EMBLEMS.map((item) => (
						<Pressable
							key={item.id}
							style={styles.cell}
							onPress={() => {
								logo.pickEmblem(item.id);
							}}
							accessibilityRole="button"
							accessibilityLabel={item.name}
							testID={`create-team-emblem-${item.id}`}
						>
							<Image
								source={item.source}
								style={[
									styles.image,
									{ borderColor: logo.emblem === item.id ? styles.active : styles.idle },
								]}
							/>
							<Text style={styles.name}>{item.name}</Text>
						</Pressable>
					))}
				</View>
			</View>
		</Sheet>
	);
};
