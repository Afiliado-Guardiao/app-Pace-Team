import React from "react";
import { View } from "react-native";

import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackButton } from "@/components/shared/BackButton";
import { useTheme } from "@/theme";

import {
	ActionButton,
	AnimatedStepContainer,
	InputStep,
	ProgressBar,
	TransitionStep,
	WheelPickerStep,
} from "./components";
import { SyncErrorModal } from "./components/SyncErrorModal";
import { useOnboardingScreen } from "./hooks/useOnboardingScreen";
import { createOnboardingScreenStyles } from "./styles";

export const OnboardingScreen: React.FC = () => {
	const { theme } = useTheme();

	const {
		stepConfig,
		progress,
		buttonText,
		isButtonDisabled,
		handleNext,
		handleBack,
		footerHeight,
		setFooterHeight,
		needsScroll,
		animationDirection,
		currentStepIndex,
		isSyncing,
		isSyncErrorVisible,
		handleRetrySync,
	} = useOnboardingScreen();

	const styles = createOnboardingScreenStyles(theme);

	const renderStep = () => {
		switch (stepConfig.type) {
			case "transition":
				return <TransitionStep {...stepConfig.props} />;
			case "input":
				return <InputStep {...stepConfig.props} />;
			case "wheel-picker":
				return <WheelPickerStep {...stepConfig.props} />;
			default:
				return null;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<BackButton onPress={handleBack} disabled={false} />
				<ProgressBar progress={progress} />
			</View>

			<AnimatedStepContainer direction={animationDirection} stepIndex={currentStepIndex}>
				<KeyboardAwareScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					style={styles.keyboardScroll}
					scrollEnabled={needsScroll}
				>
					{renderStep()}
				</KeyboardAwareScrollView>
			</AnimatedStepContainer>

			<KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
				<View
					onLayout={(event) => {
						const { height } = event.nativeEvent.layout;
						if (height !== footerHeight) {
							setFooterHeight(height);
						}
					}}
				>
					<ActionButton
						text={buttonText}
						onPress={() => {
							void handleNext();
						}}
						disabled={isButtonDisabled}
					/>
				</View>
			</KeyboardStickyView>

			<SyncErrorModal
				visible={isSyncErrorVisible}
				onRetry={() => {
					void handleRetrySync();
				}}
				isRetrying={isSyncing}
			/>
		</SafeAreaView>
	);
};
