import { KeyboardTypeOptions } from "react-native";

export type IStepType = "input" | "transition" | "wheel-picker";

export interface IStepValidation {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	errorMessageKey?: string;
}

export interface IStepBase {
	id: string;
	type: IStepType;
	titleKey: string;
	subtitleKey?: string;
}

export interface IInputStep extends IStepBase {
	type: "input";
	placeholderKey: string;
	keyboardType: KeyboardTypeOptions;
	validation?: IStepValidation;
}

export interface ITransitionStep extends IStepBase {
	type: "transition";
}

export interface IWheelPickerConfig {
	id: string;
	labelKey: string;
	data: Array<string | number>;
	unit?: string;
	width?: number;
	translationNamespace?: string;
	monthTranslationPath?: string;
}

export interface IWheelPickerStep extends IStepBase {
	type: "wheel-picker";
	pickers: IWheelPickerConfig[];
	validation?: IStepValidation;
}

export type IOnboardingStep = IInputStep | ITransitionStep | IWheelPickerStep;

export interface IValidationResult {
	isValid: boolean;
	errorKey?: string;
	errorParams?: Record<string, string | number>;
}

export interface IParsedBirthDate {
	day?: string;
	month?: string;
	year?: string;
}

export interface IUseBirthDatePickersProps {
	step: IWheelPickerStep;
	value: string;
	onChange: (value: string) => void;
}
