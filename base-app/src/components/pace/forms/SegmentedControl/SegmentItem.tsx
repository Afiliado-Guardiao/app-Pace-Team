import React from "react";
import { Pressable, Text } from "react-native";

import { GlassSurface } from "../../primitives";

import { ISegmentedControlStyles } from "./types";

interface ISegmentItemProps {
	value: string;
	label: string;
	isActive: boolean;
	onSelect: (value: string) => void;
	styles: ISegmentedControlStyles;
	testID: string;
}

// Uma aba do controle: ativa = pílula com gradiente laranja.
export const SegmentItem: React.FC<ISegmentItemProps> = ({
	value,
	label,
	isActive,
	onSelect,
	styles,
	testID,
}) => {
	const handlePress = (): void => {
		onSelect(value);
	};
	const appearance = isActive ? styles.activeAppearance : styles.idleAppearance;

	return (
		<Pressable
			testID={testID}
			accessibilityRole="tab"
			accessibilityLabel={label}
			accessibilityState={{ selected: isActive }}
			onPress={handlePress}
			style={styles.pressable}
		>
			<GlassSurface appearance={appearance} radius={styles.itemRadius} style={styles.item}>
				<Text style={isActive ? styles.activeText : styles.itemText} numberOfLines={1}>
					{label}
				</Text>
			</GlassSurface>
		</Pressable>
	);
};
