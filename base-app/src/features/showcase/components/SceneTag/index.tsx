import React from "react";
import { Text, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { IShowcaseScene, SCENES } from "../../constants";

interface ISceneTagProps {
	scene: IShowcaseScene;
	index: number;
}

const DISC = 30;

const createSceneTagStyles = (theme: ITheme) => {
	const { colors, typography, blur } = theme.pace;
	return {
		root: {
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 10,
			paddingVertical: 8,
			paddingHorizontal: 10,
		},
		glass: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		disc: {
			width: DISC,
			height: DISC,
			borderRadius: DISC / 2,
			alignItems: "center" as const,
			justifyContent: "center" as const,
			backgroundColor: colors.accent,
		},
		body: { flex: 1 },
		title: { fontFamily: typography.fonts.bold, fontSize: 13, color: colors.textPrimary },
		sub: { fontFamily: typography.fonts.medium, fontSize: 11, color: colors.textSecondary },
		dots: { flexDirection: "row" as const, gap: 3 },
		dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.dotIdle },
		on: { width: 12, backgroundColor: colors.accent },
		white: colors.onAccent,
	};
};

// Etiqueta de vidro embaixo do celular: o que a cena mostra + progresso
export const SceneTag: React.FC<ISceneTagProps> = ({ scene, index }) => {
	const { theme } = useTheme();
	const styles = createSceneTagStyles(theme);

	return (
		<GlassSurface appearance={styles.glass} radius={20} style={styles.root}>
			<View style={styles.disc}>
				<Icon name={scene.icon} size={16} color={styles.white} />
			</View>
			<View style={styles.body}>
				<Text style={styles.title}>{scene.title}</Text>
				<Text style={styles.sub}>{scene.sub}</Text>
			</View>
			<View style={styles.dots}>
				{SCENES.map((s, i) => (
					<View key={s.id} style={[styles.dot, i === index ? styles.on : null]} />
				))}
			</View>
		</GlassSurface>
	);
};
