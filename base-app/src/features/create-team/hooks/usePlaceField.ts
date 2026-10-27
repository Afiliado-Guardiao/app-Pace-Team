import { useState } from "react";

import { OTHER_PLACE } from "@/lib/pace";

interface IUsePlaceFieldReturn {
	// Opção escolhida na lista (ou "Outra")
	choice: string;
	// Texto digitado quando escolhe "Outra"
	other: string;
	isOther: boolean;
	// Valor final (lista ou texto digitado)
	value: string;
	setChoice: (value: string) => void;
	setOther: (value: string) => void;
	// Preenche com um valor salvo: se não está na lista, vira "Outra" + texto
	fill: (value: string, options: readonly string[]) => void;
}

// Campo de cidade ou região: escolhe da lista ou digita em "Outra"
export const usePlaceField = (initial: string): IUsePlaceFieldReturn => {
	const [choice, setChoice] = useState(initial);
	const [other, setOther] = useState("");
	const isOther = choice === OTHER_PLACE;

	return {
		choice,
		other,
		isOther,
		value: isOther ? other.trim() : choice,
		setChoice,
		setOther,
		fill: (value, options) => {
			const isListed = options.includes(value) && value !== OTHER_PLACE;
			setChoice(isListed ? value : OTHER_PLACE);
			setOther(isListed ? "" : value);
		},
	};
};
