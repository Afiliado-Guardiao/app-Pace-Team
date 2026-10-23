import React from "react";
import { View } from "react-native";

import { TabBar } from "@/components/pace";

import { createPaceTabRailStyles } from "./styles";

interface IPaceTabRailProps {
	active: string;
	onChange: (tabId: string) => void;
}

const RAIL_SIZE = 42;

// Navegação do app: trilho de vidro vertical centralizado na borda direita
// (Início → Perfil). Usado pelas abas e pelas telas que mostram o trilho.
export const PaceTabRail: React.FC<IPaceTabRailProps> = ({ active, onChange }) => {
	const styles = createPaceTabRailStyles();

	return (
		<View style={styles.container} pointerEvents="box-none">
			<TabBar orientation="vertical" size={RAIL_SIZE} active={active} onChange={onChange} />
		</View>
	);
};
