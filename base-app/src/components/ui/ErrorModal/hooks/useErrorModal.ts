import { useCallback, useState } from "react";

export interface IErrorModalData {
	isVisible: boolean;
	title?: string;
	message: string;
}

export interface IUseErrorModal {
	errorModal: IErrorModalData;
	showError: (message: string, title?: string) => void;
	hideError: () => void;
}

export const useErrorModal = (): IUseErrorModal => {
	const [errorModal, setErrorModal] = useState<IErrorModalData>({
		isVisible: false,
		title: undefined,
		message: "",
	});

	const showError = useCallback((message: string, title?: string) => {
		setErrorModal({
			isVisible: true,
			title,
			message,
		});
	}, []);

	const hideError = useCallback(() => {
		setErrorModal({
			isVisible: false,
			title: undefined,
			message: "",
		});
	}, []);

	return {
		errorModal,
		showError,
		hideError,
	};
};
