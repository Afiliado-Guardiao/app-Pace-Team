import React from "react";
import { ScrollView } from "react-native";

import { useTheme } from "@/theme";

import { GlassSurface } from "../../primitives";

import { SegmentItem } from "./SegmentItem";
import { createSegmentedControlStyles } from "./styles";
import { ISegmentedControlProps } from "./types";

const noop = (): void => undefined;

// Abas em pílula de vidro (ex.: Cidade · Região · Estado · País no ranking).
export const SegmentedControl: React.FC<ISegmentedControlProps> = ({
	options,
	value,
	onChange = noop,
	size = "md",
	style,
	testID = "pace-segmented",
}) => {
	const { theme } = useTheme();
	const styles = createSegmentedControlStyles(theme, size);
	const items = options.map((option) =>
		typeof option === "string" ? { value: option, label: option } : option,
	);

	return (
		<GlassSurface
			testID={testID}
			appearance={styles.containerAppearance}
			radius={theme.pace.radii.pill}
			style={[styles.surface, style]}
		>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.content}
				accessibilityRole="tablist"
			>
				{items.map((item) => (
					<SegmentItem
						key={item.value}
						value={item.value}
						label={item.label}
						isActive={item.value === value}
						onSelect={onChange}
						styles={styles}
						testID={`${testID}-${item.value}`}
					/>
				))}
			</ScrollView>
		</GlassSurface>
	);
};

export * from "./types";
