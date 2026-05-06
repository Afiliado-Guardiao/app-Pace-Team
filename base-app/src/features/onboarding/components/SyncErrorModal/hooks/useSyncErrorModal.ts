import { useCallback, useState } from "react";

export interface IUseSyncErrorModal {
	isVisible: boolean;
	showSyncError: () => void;
	hideSyncError: () => void;
}

export const useSyncErrorModal = (): IUseSyncErrorModal => {
	const [isVisible, setIsVisible] = useState(false);

	const showSyncError = useCallback(() => {
		setIsVisible(true);
	}, []);

	const hideSyncError = useCallback(() => {
		setIsVisible(false);
	}, []);

	return {
		isVisible,
		showSyncError,
		hideSyncError,
	};
};
