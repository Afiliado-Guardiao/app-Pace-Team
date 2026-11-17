import { IRulerScale } from "../hooks/useRuler";

export const SETUP_COPY = {
	title: "PACE HYDRATION",
	back: "Voltar",
	kicker: (step: number, total: number) => `PASSO ${String(step)} DE ${String(total)} · SEUS DADOS`,
	next: "Continuar",
	done: "Concluir",
	hint: "← desliza a régua →",
} as const;

export interface ISetupStep {
	key: "weight" | "height" | "age" | "health";
	label: string;
	title: string;
	lead: string;
	unit?: string;
	decimals?: number;
	scale?: IRulerScale;
}

// Os 4 passos (os 3 primeiros são régua deitada)
export const SETUP_STEPS: readonly ISetupStep[] = [
	{
		key: "weight",
		label: "Peso",
		title: "Quanto você pesa?",
		lead: "Com o seu peso o Buddy calcula quanta água você precisa no dia e depois de cada corrida.",
		unit: "kg",
		decimals: 1,
		scale: { min: 30, max: 200, step: 0.5, majorEvery: 2, labelEvery: 4 },
	},
	{
		key: "height",
		label: "Altura",
		title: "Qual é a sua altura?",
		lead: "Fica no seu perfil do PACE HYDRATION, junto com o peso.",
		unit: "cm",
		scale: { min: 120, max: 220, step: 1, majorEvery: 5, labelEvery: 10 },
	},
	{
		key: "age",
		label: "Idade",
		title: "Quantos anos você tem?",
		lead: "Se a data de nascimento está no seu cadastro, a idade já vem certa. É só ajustar se precisar.",
		unit: "anos",
		scale: { min: 12, max: 90, step: 1, majorEvery: 5, labelEvery: 5 },
	},
	{
		key: "health",
		label: "Saúde",
		title: "Alguma orientação médica?",
		lead: "Se um médico já te orientou sobre quanto beber (rins, coração e outros), o app não mostra meta: só o registro.",
	},
];
