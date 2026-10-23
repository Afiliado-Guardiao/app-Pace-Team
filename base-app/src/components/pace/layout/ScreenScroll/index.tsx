import React from "react";
import { ScrollView } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

import { staggerDelay, useEntrance } from "../../animations";

import { createScreenScrollStyles } from "./styles";
import { IScreenScrollProps } from "./types";

// Cada bloco da tela sobe com 70ms de diferença (.pt-scroll > * do design).
const RiseItem: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => {
	const { theme } = useTheme();
	const entrance = useEntrance("rise", { delay: staggerDelay(theme.pace.motion, index) });
	return <Animated.View style={entrance}>{children}</Animated.View>;
};

// Rolagem padrão das telas PACE: respiro do status bar, gutter de 22, pilha
// com 14 de espaço e, nas telas com abas, espaço para o trilho lateral.
export const ScreenScroll: React.FC<IScreenScrollProps> = ({
	children,
	hasRail = false,
	bottom,
	contentStyle,
	scrollRef,
	testID,
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const styles = createScreenScrollStyles(theme, { insets, hasRail, bottom });
	const items = React.Children.toArray(children);

	return (
		<ScrollView
			ref={scrollRef}
			testID={testID}
			style={styles.scroll}
			contentContainerStyle={[styles.content, contentStyle]}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
		>
			{items.map((child, index) => (
				<RiseItem key={index} index={index}>
					{child}
				</RiseItem>
			))}
		</ScrollView>
	);
};

export * from "./types";
