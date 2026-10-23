import React from "react";
import { View } from "react-native";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useEntrance } from "../../animations";
import { IFloatingToastData } from "../../hooks/useFloatingToast";
import { Toast } from "../Toast";

interface IFloatingToastProps {
	toast: IFloatingToastData | null;
}

const SIDE = 14;
const TOP_GAP = 8;

// Aviso que aparece no topo da tela, acima do conteúdo, e sobe suavemente.
const FloatingToastCard: React.FC<{ toast: IFloatingToastData }> = ({ toast }) => {
	const entrance = useEntrance("rise");
	return (
		<Animated.View style={entrance}>
			<Toast {...toast} />
		</Animated.View>
	);
};

export const FloatingToast: React.FC<IFloatingToastProps> = ({ toast }) => {
	const insets = useSafeAreaInsets();
	if (!toast) return null;

	return (
		<View
			pointerEvents="box-none"
			style={{
				position: "absolute",
				top: insets.top + TOP_GAP,
				left: SIDE,
				right: SIDE,
				zIndex: 30,
			}}
		>
			<FloatingToastCard key={toast.title} toast={toast} />
		</View>
	);
};
