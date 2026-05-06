import { useCallback, useMemo, useState } from "react";

import { IModalContextValue, IModalEntry } from "../../types";

interface IUseModalProviderReturn {
	activeEntry: IModalEntry | null;
	contextValue: IModalContextValue;
}

export const useModalProvider = (): IUseModalProviderReturn => {
	const [queue, setQueue] = useState<IModalEntry[]>([]);

	const enqueue = useCallback((entry: IModalEntry): void => {
		setQueue((prev) => [...prev, entry]);
	}, []);

	const dequeue = useCallback((): void => {
		setQueue((prev) => prev.slice(1));
	}, []);

	const contextValue = useMemo<IModalContextValue>(
		() => ({ enqueue, dequeue }),
		[enqueue, dequeue],
	);

	const activeEntry = queue[0] ?? null;

	return { activeEntry, contextValue };
};
