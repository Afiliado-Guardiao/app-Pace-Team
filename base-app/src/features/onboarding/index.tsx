import React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, GlassSurface, GradientLayers, Logo, useLayoutSize } from "@/components/pace";
import { useTheme } from "@/theme";

import { OrbitIntro } from "./components/OrbitIntro";
import { SlideCaption } from "./components/SlideCaption";
import { SlidePhoto } from "./components/SlidePhoto";
import { ONBOARDING_COPY, SLIDES, STEP_COUNT } from "./constants";
import { useOnboardingScreen } from "./hooks/useOnboardingScreen";
import { COMPACT_HEIGHT, createOnboardingStyles } from "./styles";

const SYMBOL_HEIGHT = 26;

// 02 Apresentação: "Monte sua equipe", "Cada km conta" e a órbita.
export const OnboardingScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const { step, isOrbit, goToStep, handleNext, handleFinish } = useOnboardingScreen();
	const { height } = useWindowDimensions();
	const styles = createOnboardingStyles(theme, insets, height < COMPACT_HEIGHT);
	const slide = SLIDES[Math.min(step, SLIDES.length - 1)];
	const skip = (
		<Button variant="glass" size="sm" onPress={handleFinish} testID="onboarding-skip">
			{ONBOARDING_COPY.skip}
		</Button>
	);

	if (isOrbit) {
		return (
			<View style={styles.root}>
				<OrbitIntro onDone={handleFinish} />
				<View style={[styles.topBar, styles.topBarEnd]}>{skip}</View>
			</View>
		);
	}

	return (
		<View style={styles.root} onLayout={onLayout}>
			{SLIDES.map((item, index) => (
				<SlidePhoto key={index} image={item.image} isVisible={index === step} />
			))}
			{size ? (
				<GradientLayers
					layers={theme.pace.gradients.onboardingScrim}
					width={size.width}
					height={size.height}
				/>
			) : null}
			<View style={styles.topBar}>
				<Logo variant="symbol" height={SYMBOL_HEIGHT} />
				{skip}
			</View>
			<View style={styles.bottom}>
				<SlideCaption key={step} slide={slide} styles={styles} />
				<GlassSurface
					appearance={styles.barAppearance}
					radius={theme.pace.radii.pill}
					style={styles.bar}
				>
					<View style={styles.dots}>
						{Array.from({ length: STEP_COUNT }).map((_, index) => (
							<Pressable
								key={index}
								onPress={() => {
									goToStep(index);
								}}
								accessibilityLabel={`Passo ${String(index + 1)}`}
								hitSlop={6}
								style={index === step ? styles.dotActive : styles.dot}
							/>
						))}
					</View>
					<Button iconRight="arrow-right" onPress={handleNext} testID="onboarding-next">
						{ONBOARDING_COPY.next}
					</Button>
				</GlassSurface>
			</View>
		</View>
	);
};
