import AsyncStorage from "@react-native-async-storage/async-storage";

import { buddyNative } from "@/lib/buddy/native";

// Onde o supabase-js guarda o login. No iPhone fica no App Group, o mesmo
// lugar que o atalho do Pace Buddy lê para salvar corridas sem abrir o app.
// Assim app e atalho sempre usam o login mais novo (se um deles renovar o
// token, o outro lê a versão nova e o servidor não derruba a sessão).
// O AsyncStorage continua como cópia (e é o único fora do iPhone).
export const sharedAuthStorage = {
	getItem: async (key: string): Promise<string | null> => {
		const shared = buddyNative.get(key);
		if (shared) return shared;
		const local = await AsyncStorage.getItem(key);
		// Primeira vez depois da atualização: leva o login para o App Group
		if (local) buddyNative.set(key, local);
		return local;
	},
	setItem: async (key: string, value: string): Promise<void> => {
		buddyNative.set(key, value);
		await AsyncStorage.setItem(key, value);
	},
	removeItem: async (key: string): Promise<void> => {
		buddyNative.remove(key);
		await AsyncStorage.removeItem(key);
	},
};
