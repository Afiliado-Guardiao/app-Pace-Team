import { TextStyle, ViewStyle } from "react-native";

import { IUser } from "@/store";

export type { IUser };

export interface IProfileScreenStyles {
	container: ViewStyle;
	scrollContent: ViewStyle;
	topRow: ViewStyle;
	heroLeft: ViewStyle;
	avatar: ViewStyle;
	avatarText: TextStyle;
	heroInfo: ViewStyle;
	heroName: TextStyle;
	heroEmail: TextStyle;
	section: ViewStyle;
	lastMenuItem: ViewStyle;
}

export interface IUseProfileScreenReturn {
	user: IUser | null;
	editName: () => void;
	editEmail: () => void;
	editBirthday: () => void;
	editPassword: () => void;
	handleLogout: () => void;
	handleDeleteAccount: () => void;
}
