import React from "react";
import { Pressable, Text } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";

import { createTabButtonStyles } from "./styles";
import { ITabItem } from "./types";

interface ITabButtonProps {
	item: ITabItem;
	size: number;
	isActive: boolean;
	isAccent: boolean;
	showLabel: boolean;
	onChange?: (id: string) => void;
}

// Botão circular da barra horizontal: ativo = laranja sólido; destaque = gradiente.
export const TabButton: React.FC<ITabButtonProps> = ({
	item,
	size,
	isActive,
	isAccent,
	showLabel,
	onChange,
}) => {
	const { theme } = useTheme();
	const styles = createTabButtonStyles(theme, { size, isActive, isAccent });
	const handlePress = (): void => {
		onChange?.(item.id);
	};

	return (
		<Pressable
			testID={`pace-tab-${item.id}`}
			accessibilityRole="tab"
			accessibilityLabel={item.label}
			accessibilityState={{ selected: isActive }}
			onPress={handlePress}
		>
			<GlassSurface appearance={styles.appearance} radius={size / 2} style={styles.button}>
				<Icon
					name={item.icon}
					size={styles.iconSize}
					strokeWidth={styles.strokeWidth}
					color={theme.pace.colors.ink.white}
				/>
				{showLabel ? <Text style={styles.label}>{item.label}</Text> : null}
			</GlassSurface>
		</Pressable>
	);
};
