import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	Button,
	FloatingToast,
	GradientLayers,
	ScreenBackground,
	TopBar,
	useLayoutSize,
} from "@/components/pace";
import { useTheme } from "@/theme";
import { PHOTOS } from "@/lib/pace";

import { ShareTabButton } from "./components/ShareTabButton";
import { ShareThumb, THUMB } from "./components/ShareThumb";
import { StoryCanvas } from "./components/StoryCanvas";
import { SHARE_BGS, SHARE_COPY, SHARE_TEMPLATES, STORY } from "./constants";
import { useRunShare } from "./hooks/useRunShare";
import { createRunShareStyles } from "./styles";

const BACKDROP_BLUR = 34;

// 06e Compartilhar: stories 1080 × 1920 da última corrida (PNG com ou sem fundo).
export const RunShareScreen: React.FC = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { size, onLayout } = useLayoutSize();
	const share = useRunShare();
	const styles = createRunShareStyles(theme, insets);
	const previewWidth = size ? Math.min(size.width, (size.height * STORY.width) / STORY.height) : 0;
	const note = `${share.isTransparent ? SHARE_COPY.notePlain : SHARE_COPY.notePhoto}${share.isDemo ? SHARE_COPY.noteDemo : ""}`;

	return (
		<View style={styles.root}>
			<ScreenBackground photo={PHOTOS.teamTrack} blur={BACKDROP_BLUR} />
			<View style={styles.column}>
				<TopBar title={SHARE_COPY.title} onBack={share.goBack} />
				<View style={styles.previewArea} onLayout={onLayout}>
					{previewWidth ? (
						<View style={styles.preview}>
							<StoryCanvas
								template={share.template.id}
								background={share.background}
								run={share.run}
								width={previewWidth}
								canvasRef={share.canvasRef}
							/>
						</View>
					) : null}
				</View>
				<View style={styles.tabs}>
					<ShareTabButton
						icon="layout-template"
						label={SHARE_COPY.templates}
						isActive={share.panel === "templates"}
						onPress={share.showTemplates}
						testID="share-tab-templates"
					/>
					<ShareTabButton
						icon="image"
						label={SHARE_COPY.background}
						isActive={share.panel === "background"}
						onPress={share.showBackgrounds}
						testID="share-tab-background"
					/>
				</View>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.rail}
					contentContainerStyle={styles.railContent}
				>
					{share.panel === "templates"
						? SHARE_TEMPLATES.map((t, i) => (
								<ShareThumb
									key={t.id}
									label={t.name}
									isSelected={i === share.templateIndex}
									onPress={() => {
										share.setTemplateIndex(i);
									}}
									testID={`share-template-${t.id}`}
								>
									<StoryCanvas
										template={t.id}
										background={share.background}
										run={share.run}
										width={THUMB.width}
									/>
								</ShareThumb>
							))
						: SHARE_BGS.map((bg, i) => (
								<ShareThumb
									key={bg.id}
									label={bg.label}
									isSelected={i === share.backgroundIndex}
									onPress={() => {
										share.setBackgroundIndex(i);
									}}
									testID={`share-bg-${bg.id}`}
								>
									{bg.photo ? <Image source={bg.photo} style={styles.thumbFill} /> : null}
									{bg.gradient ? (
										<GradientLayers
											layers={theme.pace.gradients[bg.gradient]}
											width={THUMB.width}
											height={THUMB.height}
										/>
									) : null}
									{bg.photo || bg.gradient ? null : (
										<StoryCanvas
											template={share.template.id}
											background={bg}
											run={share.run}
											width={THUMB.width}
											hasContent={false}
										/>
									)}
								</ShareThumb>
							))}
				</ScrollView>
				<Button
					fullWidth
					size="lg"
					icon="share-2"
					disabled={share.isSharing}
					onPress={share.share}
					testID="share-submit"
				>
					{SHARE_COPY.share}
				</Button>
				<Text style={styles.note}>{note}</Text>
			</View>
			<FloatingToast toast={share.toast} />
		</View>
	);
};
