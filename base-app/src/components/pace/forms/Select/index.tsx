import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useTheme } from "@/theme";

import { Icon } from "../../core/Icon";
import { GlassSurface } from "../../primitives";
import { Sheet } from "../../surfaces/Sheet";
import { Radio } from "../Radio";

import { useSelect } from "./hooks/useSelect";
import { createSelectStyles } from "./styles";
import { ISelectProps } from "./types";

const ICON_SIZE = 18;

// Campo de seleção de vidro. No app, as opções abrem numa folha inferior
// (o <select> nativo da web não existe no iOS).
export const Select: React.FC<ISelectProps> = ({
	label,
	icon,
	options,
	value,
	defaultValue,
	onChange,
	placeholder,
	style,
	testID = "pace-select",
}) => {
	const { theme } = useTheme();
	const select = useSelect({ options, value, defaultValue, onChange });
	const styles = createSelectStyles(theme);
	const shown = select.currentLabel ?? placeholder;

	return (
		<View style={[styles.root, style]}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<Pressable
				testID={testID}
				accessibilityRole="button"
				accessibilityLabel={label}
				accessibilityValue={{ text: select.currentLabel }}
				onPress={select.open}
			>
				<GlassSurface
					appearance={styles.appearance}
					radius={theme.pace.radii.md}
					style={styles.field}
				>
					{icon ? <Icon name={icon} size={ICON_SIZE} color={styles.iconColor} /> : null}
					<Text style={select.currentLabel ? styles.value : styles.placeholder} numberOfLines={1}>
						{shown}
					</Text>
					<Icon name="chevron-down" size={ICON_SIZE} color={styles.iconColor} />
				</GlassSurface>
			</Pressable>
			<Sheet open={select.isOpen} title={label} onClose={select.close} testID={`${testID}-sheet`}>
				<ScrollView
					style={styles.listScroll}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
				>
					{select.items.map((item) => (
						<Radio
							key={item.value}
							label={item.label}
							checked={item.value === select.current}
							onChange={() => {
								select.select(item.value);
							}}
							testID={`${testID}-option-${item.value}`}
						/>
					))}
				</ScrollView>
			</Sheet>
		</View>
	);
};

export * from "./types";
