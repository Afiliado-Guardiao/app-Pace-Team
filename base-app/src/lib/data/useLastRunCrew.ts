import { useMemo } from "react";

import { useRunStore } from "@/lib/run";
import { useStore } from "@/store";

import { buildRunCrew, IRunCrew } from "./runCrew";
import { useRunCrew } from "./useRunCrew";

// Desenho da "última corrida" (a que acabou de terminar ou a aberta pelo
// Histórico/aviso) para compartilhar e postar: a turma vem do servidor pela
// corrida salva, igual em todo celular. Sem ela (ainda salvando), só o seu
// percurso.
export const useLastRunCrew = (): IRunCrew => {
	const lastResult = useRunStore((s) => s.lastResult);
	const myPhoto = useStore((s) => s.user?.avatarUrl ?? null);
	const myName = useStore((s) => s.user?.name ?? "");
	const { runners } = useRunCrew(lastResult?.saved?.id);

	return useMemo(() => {
		const route = (lastResult?.points ?? []).map((p) => [p.lat, p.lng] as const);
		// Corrida de um colega (aberta pelo aviso): a foto e o nome são dele
		const owner = runners.find((r) => r.isOwner);
		const me = owner
			? { name: owner.name, photo: owner.photo, route }
			: { name: myName, photo: myPhoto, route };
		return buildRunCrew(me, runners);
	}, [lastResult, runners, myName, myPhoto]);
};
