import { Alert } from "react-native";

import { IRun } from "@/lib/pace";

import { useDeleteRun } from "./useDeleteRun";

const COPY = {
	title: "Excluir corrida validada?",
	body: "Os pontos dela saem da sua equipe no ranking.",
	cancel: "Cancelar",
	confirm: "Excluir",
} as const;

// Corrida validada vale pontos: pergunta antes de apagar
const confirmValid = (): Promise<boolean> =>
	new Promise((resolve) => {
		Alert.alert(COPY.title, COPY.body, [
			{
				text: COPY.cancel,
				style: "cancel",
				onPress: () => {
					resolve(false);
				},
			},
			{
				text: COPY.confirm,
				style: "destructive",
				onPress: () => {
					resolve(true);
				},
			},
		]);
	});

interface IUseRemoveRunReturn {
	// true = excluiu; false = desistiu ou deu erro (a linha volta)
	remove: (run: IRun) => Promise<boolean>;
}

// Excluir corrida arrastando no Histórico e no Perfil
export const useRemoveRun = (): IUseRemoveRunReturn => {
	const deleteRun = useDeleteRun();

	return {
		remove: async (run) => {
			if (typeof run.id !== "string") return false;
			if (run.status === "valid" && !(await confirmValid())) return false;
			try {
				await deleteRun.mutateAsync(run.id);
				return true;
			} catch {
				return false;
			}
		},
	};
};
