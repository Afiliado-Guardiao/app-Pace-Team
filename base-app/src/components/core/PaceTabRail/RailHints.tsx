import React from "react";
import { View, ViewStyle } from "react-native";

import { HintTip } from "@/components/shared";
import { IHintId, useHint } from "@/lib/hints";

interface IRailHintsProps {
	size: number;
}

// Mesmas medidas do trilho (TabBar vertical): folga, espaço entre abas
const PAD = 6;
const GAP = 6;
// Abas com dica, na ordem do trilho (Início é a tela onde ele já está)
const TABS: readonly { id: IHintId; index: number }[] = [
	{ id: "tab-run", index: 1 },
	{ id: "tab-ranking", index: 2 },
	{ id: "tab-team", index: 3 },
	{ id: "tab-profile", index: 4 },
];

const RailHint: React.FC<{ id: IHintId; index: number; size: number }> = ({ id, index, size }) => {
	const hint = useHint(id);
	const anchor: ViewStyle = {
		position: "absolute",
		right: PAD,
		top: PAD + index * (size + GAP),
		width: size,
		height: size,
	};
	return (
		<View style={anchor} pointerEvents="none">
			<HintTip id={id} isShown={hint.isShown} side="left" />
		</View>
	);
};

// Dicas das abas: a frase aparece à esquerda da aba, com a seta apontando
export const RailHints: React.FC<IRailHintsProps> = ({ size }) => (
	<>
		{TABS.map((t) => (
			<RailHint key={t.id} id={t.id} index={t.index} size={size} />
		))}
	</>
);
