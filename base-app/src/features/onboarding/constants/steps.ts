import { IOnboardingStep } from "../types";

import { generateDaysForMonth, getValidBirthYears, MONTH_KEYS } from "./birthDate";

export const VALIDATION_PATTERNS = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
} as const;

export const ONBOARDING_STEPS: IOnboardingStep[] = [
	{
		id: "transition",
		type: "transition",
		titleKey: "transition.title",
		subtitleKey: "transition.subtitle",
	},
	{
		id: "name",
		type: "input",
		titleKey: "steps.name.title",
		placeholderKey: "steps.name.placeholder",
		keyboardType: "default",
		validation: {
			required: true,
			minLength: 2,
		},
	},
	{
		id: "email",
		type: "input",
		titleKey: "steps.email.title",
		placeholderKey: "steps.email.placeholder",
		keyboardType: "email-address",
		validation: {
			required: true,
			pattern: VALIDATION_PATTERNS.email,
			errorMessageKey: "validation.invalidEmail",
		},
	},
	{
		id: "birthday",
		type: "wheel-picker",
		titleKey: "steps.birthday.title",
		subtitleKey: "steps.birthday.subtitle",
		pickers: [
			{
				id: "day",
				labelKey: "steps.birthday.pickers.day",
				data: generateDaysForMonth("january"),
				width: 70,
			},
			{
				id: "month",
				labelKey: "steps.birthday.pickers.month",
				data: [...MONTH_KEYS],
				monthTranslationPath: "steps.birthday.months",
				width: 130,
			},
			{
				id: "year",
				labelKey: "steps.birthday.pickers.year",
				data: getValidBirthYears(),
				width: 80,
			},
		],
		validation: {
			required: true,
		},
	},
];
