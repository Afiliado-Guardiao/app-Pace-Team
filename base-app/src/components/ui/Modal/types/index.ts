import React from "react";

export type IModalVariant = "default" | "danger";

export interface IConfirmOptions {
	title: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: IModalVariant;
	dismissOnBackdrop?: boolean;
}

export interface IInputOptions {
	title: string;
	placeholder?: string;
	initialValue?: string;
	validation?: (value: string) => string | null;
	confirmLabel?: string;
	cancelLabel?: string;
}

export interface IAlertOptions {
	title: string;
	message?: string;
	confirmLabel?: string;
	dismissOnBackdrop?: boolean;
}

export type IModalType = "confirm" | "input" | "alert" | "custom";

export interface IModalEntryBase {
	id: string;
	type: IModalType;
}

export interface IConfirmModalEntry extends IModalEntryBase {
	type: "confirm";
	options: IConfirmOptions;
	resolve: (value: boolean) => void;
}

export interface IInputModalEntry extends IModalEntryBase {
	type: "input";
	options: IInputOptions;
	resolve: (value: string | null) => void;
}

export interface IAlertModalEntry extends IModalEntryBase {
	type: "alert";
	options: IAlertOptions;
	resolve: () => void;
}

export interface ICustomModalEntry extends IModalEntryBase {
	type: "custom";
	content: React.ReactNode;
}

export type IModalEntry =
	| IConfirmModalEntry
	| IInputModalEntry
	| IAlertModalEntry
	| ICustomModalEntry;

export interface IModalAPI {
	confirm: (options: IConfirmOptions) => Promise<boolean>;
	input: (options: IInputOptions) => Promise<string | null>;
	alert: (options: IAlertOptions) => Promise<void>;
	custom: (content: React.ReactNode) => void;
	close: () => void;
}

export interface IModalContextValue {
	enqueue: (entry: IModalEntry) => void;
	dequeue: () => void;
}
