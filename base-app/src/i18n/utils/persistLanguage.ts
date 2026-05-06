import AsyncStorage from "@react-native-async-storage/async-storage";

import { LANGUAGE_STORAGE_KEY } from "../constants";
import { ILocale } from "../types";

export const saveLanguage = async (language: ILocale): Promise<void> => {
	try {
		await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
	} catch {
	}
};

export const loadLanguage = async (): Promise<ILocale | null> => {
	try {
		const language = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
		return language as ILocale | null;
	} catch {
		return null;
	}
};
