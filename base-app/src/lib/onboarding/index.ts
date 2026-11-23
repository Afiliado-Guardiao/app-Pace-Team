import { useStore } from "@/store";

// Conta nova que pulou a apresentação (entrou direto pelo e-mail ou pela
// Apple na tela de boas-vindas): o onboarding começa na escolha da equipe
// (montar, entrar com código ou correr sozinho), sem o gráfico e as perguntas.
export const startShortSetup = (): void => {
	const { setAnswer } = useStore.getState();
	setAnswer("setupStep", "team");
	setAnswer("setupShort", "1");
};
