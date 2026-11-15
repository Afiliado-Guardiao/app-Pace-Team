import React from "react";
import { View } from "react-native";

import { TabBar } from "@/components/pace";
import { HINTS, IHintId, useHintStore } from "@/lib/hints";

import { RailHints } from "./RailHints";
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
			<View>
				<TabBar
					orientation="vertical"
					size={RAIL_SIZE}
					active={active}
					onChange={(tabId) => {
						// Tocou na aba: a dica dela some de vez
						const hintId = `tab-${tabId}`;
						if (hintId in HINTS) useHintStore.getState().finish(hintId as IHintId);
						onChange(tabId);
					}}
				/>
				<RailHints size={RAIL_SIZE} />
			</View>
		</View>
	);
};
