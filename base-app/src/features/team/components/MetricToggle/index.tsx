import React from "react";
import { Pressable, Text, View } from "react-native";

import { GradientLayers, useLayoutSize } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

interface IMetricToggleProps<T extends string> {
	options: readonly T[];
	value: T;
	onChange: (value: T) => void;
}

const HEIGHT = 28;

const createMetricToggleStyles = (theme: ITheme) => {
	const { colors, radii, typography } = theme.pace;
	return {
		root: {
			flexDirection: "row" as const,
			padding: 3,
			gap: 2,
			borderRadius: radii.pill,
			backgroundColor: colors.segLiteBg,
			borderWidth: 1,
			borderColor: colors.glassBorder,
		},
		option: {
			height: HEIGHT,
			paddingHorizontal: 11,
			borderRadius: radii.pill,
			overflow: "hidden" as const,
			justifyContent: "center" as const,
		},
		fill: { position: "absolute" as const, top: 0, left: 0 },
		label: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.textSecondary,
		},
		labelOn: { color: colors.textPrimary },
	};
};

const ToggleOption: React.FC<{ label: string; isActive: boolean; onPress: () => void }> = ({
	label,
	isActive,
	onPress,
}) => {
	const { theme } = useTheme();
	const { size, onLayout } = useLayoutSize();
	const styles = createMetricToggleStyles(theme);

	return (
		<Pressable
			style={styles.option}
			onLayout={onLayout}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ selected: isActive }}
			testID={`metric-${label}`}
		>
			{isActive && size ? (
				<View style={styles.fill}>
					<GradientLayers
						layers={theme.pace.gradients.accent}
						width={size.width}
						height={size.height}
					/>
				</View>
			) : null}
			<Text style={[styles.label, isActive ? styles.labelOn : null]}>{label}</Text>
		</Pressable>
	);
};

// Alternador compacto (Pontos / Km) do pódio da equipe.
export const MetricToggle = <T extends string>({
	options,
	value,
	onChange,
}: IMetricToggleProps<T>): React.ReactElement => {
	const { theme } = useTheme();
	const styles = createMetricToggleStyles(theme);

	return (
		<View style={styles.root}>
			{options.map((o) => (
				<ToggleOption
					key={o}
					label={o}
					isActive={o === value}
					onPress={() => {
						onChange(o);
					}}
				/>
			))}
		</View>
	);
};
