import React, { useContext } from "react";

import { ModalContext } from "../context";
import { IAlertOptions, IConfirmOptions, IInputOptions, IModalAPI } from "../types";

let _idCounter = 0;
const generateId = (): string => {
	_idCounter += 1;
	return `modal-${String(_idCounter)}`;
};

export const useModal = (): IModalAPI => {
	const ctx = useContext(ModalContext);

	if (!ctx) {
		throw new Error("useModal must be used inside <ModalProvider>");
	}

	const { enqueue, dequeue } = ctx;

	const confirm = (options: IConfirmOptions): Promise<boolean> => {
		return new Promise<boolean>((resolve) => {
			enqueue({
				id: generateId(),
				type: "confirm",
				options,
				resolve,
			});
		});
	};

	const input = (options: IInputOptions): Promise<string | null> => {
		return new Promise<string | null>((resolve) => {
			enqueue({
				id: generateId(),
				type: "input",
				options,
				resolve,
			});
		});
	};

	const alert = (options: IAlertOptions): Promise<void> => {
		return new Promise<void>((resolve) => {
			enqueue({
				id: generateId(),
				type: "alert",
				options,
				resolve,
			});
		});
	};

	const custom = (content: React.ReactNode): void => {
		enqueue({
			id: generateId(),
			type: "custom",
			content,
		});
	};

	const close = (): void => {
		dequeue();
	};

	return { confirm, input, alert, custom, close };
};
