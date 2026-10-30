import { useState } from "react";

import { SIZE_OPTIONS } from "../constants";

export interface IUseTeamSizeReturn {
	size: string;
	// "Outra": escolhe o número na lista de 2 a 50
	isOther: boolean;
	pick: (value: string) => void;
	pickOther: () => void;
	setOtherSize: (value: string) => void;
	// Preenche com o tamanho salvo: fora dos atalhos, abre em "Outra"
	fill: (value: string) => void;
}

const isShortcut = (value: string): boolean => SIZE_OPTIONS.some((option) => option === value);

// Tamanho da equipe: atalhos (2, 3, 5, 10) ou qualquer número em "Outra"
export const useTeamSize = (): IUseTeamSizeReturn => {
	const [size, setSize] = useState("5");
	const [isOther, setIsOther] = useState(false);

	return {
		size,
		isOther,
		pick: (value) => {
			setIsOther(false);
			setSize(value);
		},
		pickOther: () => {
			setIsOther(true);
		},
		setOtherSize: setSize,
		fill: (value) => {
			setIsOther(!isShortcut(value));
			setSize(value);
		},
	};
};
