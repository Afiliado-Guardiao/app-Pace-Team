import React from "react";
import { Text, TextInput, View } from "react-native";

import {
	Button,
	Chip,
	GlassSurface,
	ScreenBackground,
	ScreenScroll,
	TopBar,
} from "@/components/pace";
import { PostArt } from "@/components/shared/PostArt";
import { ITheme, useTheme } from "@/theme";

import { POST_COPY } from "../../constants";
import { IUseRunPostReturn } from "../../hooks/useRunPost";

interface IEditStepProps {
	post: IUseRunPostReturn;
}

const ART_RADIUS = 28;
const CAPTION_RADIUS = 20;
const BACKDROP_BLUR = 30;

const createEditStepStyles = (theme: ITheme) => {
	const { blur, colors, typography } = theme.pace;
	return {
		root: { flex: 1, backgroundColor: colors.bgApp },
		content: { gap: 16 },
		art: {
			borderRadius: ART_RADIUS,
			overflow: "hidden" as const,
			borderWidth: 1,
			borderColor: colors.cameraThumbBorder,
			boxShadow: "0 26px 50px -24px rgba(0,0,0,.85)",
		},
		chips: { flexDirection: "row" as const, gap: 8, justifyContent: "center" as const },
		captionAppearance: {
			fill: "glassFill" as const,
			blur: blur.intensity.glass,
			border: colors.glassBorder,
			rim: true,
		},
		captionBox: { paddingVertical: 14, paddingHorizontal: 16 },
		caption: {
			minHeight: typography.sizes.ui * 1.4 * 2,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			lineHeight: typography.sizes.ui * 1.4,
			color: colors.textPrimary,
			textAlignVertical: "top" as const,
		},
		note: {
			textAlign: "center" as const,
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.xs,
			lineHeight: typography.sizes.xs * 1.4,
			color: colors.textTertiary,
		},
	};
};

// Etapa 2: escolhe as camadas da arte, escreve a legenda e publica.
export const EditStep: React.FC<IEditStepProps> = ({ post }) => {
	const { theme } = useTheme();
	const styles = createEditStepStyles(theme);

	return (
		<View style={styles.root}>
			<ScreenBackground photo={post.image} blur={BACKDROP_BLUR} />
			<ScreenScroll bottom={34} contentStyle={styles.content}>
				<TopBar title={POST_COPY.editTitle} onBack={post.backToCamera} />
				<View style={styles.art}>
					<PostArt
						image={post.image}
						seconds={post.run.seconds}
						km={post.run.km}
						team={post.team}
						track={post.track}
						layers={post.layers}
					/>
				</View>
				<View style={styles.chips}>
					<Chip
						selected={post.layers.stats}
						onPress={() => {
							post.toggleLayer("stats");
						}}
						testID="post-layer-stats"
					>
						{POST_COPY.stats}
					</Chip>
					<Chip
						selected={post.layers.route}
						onPress={() => {
							post.toggleLayer("route");
						}}
						testID="post-layer-route"
					>
						{POST_COPY.route}
					</Chip>
					<Chip
						selected={post.layers.badge}
						onPress={() => {
							post.toggleLayer("badge");
						}}
						testID="post-layer-badge"
					>
						{POST_COPY.team}
					</Chip>
				</View>
				<GlassSurface
					appearance={styles.captionAppearance}
					radius={CAPTION_RADIUS}
					style={styles.captionBox}
				>
					<TextInput
						value={post.caption}
						onChangeText={post.setCaption}
						placeholder={POST_COPY.captionPlaceholder}
						placeholderTextColor={theme.pace.colors.textTertiary}
						multiline
						style={styles.caption}
						accessibilityLabel={POST_COPY.captionPlaceholder}
						testID="post-caption"
					/>
				</GlassSurface>
				<Button fullWidth size="lg" icon="send" onPress={post.publish} testID="post-publish">
					{POST_COPY.publish}
				</Button>
				{post.isPreview ? <Text style={styles.note}>{POST_COPY.demoNote}</Text> : null}
			</ScreenScroll>
		</View>
	);
};
