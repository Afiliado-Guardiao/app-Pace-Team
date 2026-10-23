import { TextStyle, ViewStyle } from "react-native";

export interface ICatalogTeam {
	name: string;
	city: string;
	points: string;
	km: number;
	delta: number;
	isYou?: boolean;
}

// Estado das demonstrações interativas, compartilhado com as seções
export interface ICatalogState {
	replayKey: number;
	chip: string;
	setChip: (value: string) => void;
	scope: string;
	setScope: (value: string) => void;
	teamSize: string;
	setTeamSize: (value: string) => void;
	email: string;
	setEmail: (value: string) => void;
	acceptedTerms: boolean;
	setAcceptedTerms: (value: boolean) => void;
	notifications: boolean;
	setNotifications: (value: boolean) => void;
	isSheetOpen: boolean;
	openSheet: () => void;
	closeSheet: () => void;
	tab: string;
	setTab: (value: string) => void;
	replay: () => void;
	goBack: () => void;
}

export interface ICatalogStyles {
	scroll: ViewStyle;
	content: ViewStyle;
	header: ViewStyle;
	headerTitle: TextStyle;
	headerHint: TextStyle;
	rail: ViewStyle;
}

export interface ICatalogSectionStyles {
	section: ViewStyle;
	title: TextStyle;
	caption: TextStyle;
	row: ViewStyle;
	rowCenter: ViewStyle;
	column: ViewStyle;
	grow: ViewStyle;
	growWide: ViewStyle;
	label: TextStyle;
	cardTitle: TextStyle;
	cardText: TextStyle;
	metric: TextStyle;
}
