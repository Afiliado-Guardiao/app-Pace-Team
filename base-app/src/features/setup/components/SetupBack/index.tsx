import React from "react";
import { Pressable, View } from "react-native";

import { GlassSurface, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_COPY } from "../../constants";

interface ISetupBackProps {
	onBack?: () => void;
}

const BACK = 40;

const createSetupBackStyles = (theme: ITheme) => {
	const { colors, blur } = theme.pace;
	return {
		root: { height: BACK, flexDirection: "row" as const },
		back: {
			width: BACK,
			height: BACK,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		backAppearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
	};
};

// Topo das etapas: só o voltar (vidro). Sem barra de progresso: o atleta não
// sabe se está no começo ou no fim
export const SetupBack: React.FC<ISetupBackProps> = ({ onBack }) => {
	const { theme } = useTheme();
	const styles = createSetupBackStyles(theme);

	return (
		<View style={styles.root}>
			{onBack ? (
				<Pressable
					onPress={onBack}
					accessibilityRole="button"
					accessibilityLabel={SETUP_COPY.back}
					testID="setup-back"
				>
					<GlassSurface appearance={styles.backAppearance} radius={BACK / 2} style={styles.back}>
						<Icon name="chevron-left" size={20} />
					</GlassSurface>
				</Pressable>
			) : null}
		</View>
	);
};
