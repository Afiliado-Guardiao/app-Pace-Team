import React from "react";

import { IInputStep, ITransitionStep, IWheelPickerStep } from "./steps";

export interface IActionButtonProps {
	text: string;
	onPress: () => void;
	disabled: boolean;
}

export interface IBackButtonProps {
	onPress: () => void;
	disabled: boolean;
}

export interface IProgressBarProps {
	progress: number;
}

export interface IInputStepProps {
	step: IInputStep;
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export interface ITransitionStepProps {
	step: ITransitionStep;
}

export interface IWheelPickerStepProps {
	step: IWheelPickerStep;
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

export interface IAnimatedContentProps {
	children: React.ReactNode;
	triggerKey?: string;
}

export interface IAnimatedOptionProps {
	index: number;
	children: React.ReactNode;
}

export interface IAnimatedStepContainerProps {
	children: React.ReactNode;
	direction: "forward" | "backward";
	stepIndex?: number;
}
