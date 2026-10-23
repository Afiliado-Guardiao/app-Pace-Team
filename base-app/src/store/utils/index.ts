import AsyncStorage from "@react-native-async-storage/async-storage";

export const clearStore = async () => {
	await AsyncStorage.removeItem("@pace-team:store");
};
