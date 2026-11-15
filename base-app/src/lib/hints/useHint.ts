import { useCallback, useEffect } from "react";

import { IHintId } from "./constants";
import { useHintStore } from "./store";

interface IUseHintReturn {
	isShown: boolean;
	// Chamar no toque do botão: a dica some e não volta
	done: () => void;
}

// Um botão com dica: avisa que está na tela e diz se a dica dele está aparecendo
export const useHint = (id: IHintId): IUseHintReturn => {
	const isShown = useHintStore((s) => s.active === id);
	const mount = useHintStore((s) => s.mount);
	const unmount = useHintStore((s) => s.unmount);
	const finish = useHintStore((s) => s.finish);

	useEffect(() => {
		mount(id);
		return () => {
			unmount(id);
		};
	}, [id, mount, unmount]);

	const done = useCallback(() => {
		finish(id);
	}, [finish, id]);

	return { isShown, done };
};
