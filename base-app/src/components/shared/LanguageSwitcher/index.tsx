import React from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme";
import { ILocale, SUPPORTED_LOCALES } from "@/i18n";

import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from "./constants";
import { useLanguageSwitcher } from "./hooks";
import { createLanguageSwitcherStyles } from "./styles";
import { ILanguageSwitcherProps } from "./types";

export const LanguageSwitcher: React.FC<ILanguageSwitcherProps> = ({ style }) => {
	const { theme } = useTheme();
	const { currentLanguage, isModalOpen, openModal, closeModal, handleLanguageChange } =
		useLanguageSwitcher();
	const styles = createLanguageSwitcherStyles(theme);

	const getLanguageCode = (locale: ILocale) => {
		return locale.split("-")[0].toUpperCase();
	};

	return (
		<>
			<Pressable
				testID="btn-language-switcher"
				accessibilityLabel="Switch language"
				onPress={openModal}
				style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }, style]}
			>
				<Text style={styles.flag}>{LANGUAGE_FLAGS[currentLanguage]}</Text>
				<Text style={styles.code}>{getLanguageCode(currentLanguage)}</Text>
			</Pressable>

			<Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={closeModal}>
				<Pressable
					testID="btn-language-modal-overlay"
					accessibilityLabel="Close language selector"
					style={styles.overlay}
					onPress={closeModal}
				>
					<View style={styles.modalContent}>
						<FlatList
							data={SUPPORTED_LOCALES}
							keyExtractor={(item) => item}
							renderItem={({ item }) => {
								const isActive = currentLanguage === item;

								return (
									<Pressable
										testID={`btn-language-option-${item}`}
										accessibilityLabel={LANGUAGE_LABELS[item]}
										onPress={() => {
											handleLanguageChange(item);
										}}
										style={({ pressed }) => [
											styles.option,
											isActive && styles.activeOption,
											pressed && { opacity: 0.7 },
										]}
									>
										<Text style={styles.optionFlag}>{LANGUAGE_FLAGS[item]}</Text>
										<Text style={[styles.optionText, isActive && styles.activeOptionText]}>
											{LANGUAGE_LABELS[item]}
										</Text>
										{isActive && <Text style={styles.checkmark}>✓</Text>}
									</Pressable>
								);
							}}
						/>
					</View>
				</Pressable>
			</Modal>
		</>
	);
};

export * from "./types";
