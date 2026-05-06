import React from "react";
import { Modal as RNModal, Pressable, View } from "react-native";

import { useTheme } from "@/theme";

import { AlertModal } from "../components/AlertModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { CustomModal } from "../components/CustomModal";
import { InputModal } from "../components/InputModal";
import { ModalContextProvider } from "../context";

import { useModalProvider } from "./hooks/useModalProvider";
import { createModalProviderStyles } from "./styles";

interface IModalProviderProps {
	children: React.ReactNode;
}

export const ModalProvider: React.FC<IModalProviderProps> = ({ children }) => {
	const { theme } = useTheme();
	const styles = createModalProviderStyles(theme);
	const { activeEntry, contextValue } = useModalProvider();

	const handleBackdropPress = (): void => {
		if (!activeEntry) {
			return;
		}
		if (activeEntry.type === "confirm") {
			if (activeEntry.options.dismissOnBackdrop !== false) {
				activeEntry.resolve(false);
				contextValue.dequeue();
			}
			return;
		}
		if (activeEntry.type === "alert") {
			if (activeEntry.options.dismissOnBackdrop !== false) {
				activeEntry.resolve();
				contextValue.dequeue();
			}
			return;
		}
		if (activeEntry.type === "input") {
			activeEntry.resolve(null);
			contextValue.dequeue();
			return;
		}
		contextValue.dequeue();
	};

	const renderActive = (): React.ReactNode => {
		if (!activeEntry) {
			return null;
		}

		if (activeEntry.type === "confirm") {
			return (
				<ConfirmModal
					options={activeEntry.options}
					onConfirm={() => {
						activeEntry.resolve(true);
						contextValue.dequeue();
					}}
					onCancel={() => {
						activeEntry.resolve(false);
						contextValue.dequeue();
					}}
				/>
			);
		}

		if (activeEntry.type === "alert") {
			return (
				<AlertModal
					options={activeEntry.options}
					onConfirm={() => {
						activeEntry.resolve();
						contextValue.dequeue();
					}}
				/>
			);
		}

		if (activeEntry.type === "input") {
			return (
				<InputModal
					options={activeEntry.options}
					onConfirm={(value) => {
						activeEntry.resolve(value);
						contextValue.dequeue();
					}}
					onCancel={() => {
						activeEntry.resolve(null);
						contextValue.dequeue();
					}}
				/>
			);
		}

		return <CustomModal content={activeEntry.content} />;
	};

	return (
		<ModalContextProvider value={contextValue}>
			{children}
			<RNModal
				visible={activeEntry !== null}
				transparent
				animationType="fade"
				onRequestClose={handleBackdropPress}
			>
				<Pressable
					testID="modal-backdrop"
					accessibilityLabel="Close modal"
					style={styles.backdrop}
					onPress={handleBackdropPress}
				>
					<Pressable
						style={styles.sheet}
						onPress={(e) => {
							e.stopPropagation();
						}}
					>
						<View>{renderActive()}</View>
					</Pressable>
				</Pressable>
			</RNModal>
		</ModalContextProvider>
	);
};
