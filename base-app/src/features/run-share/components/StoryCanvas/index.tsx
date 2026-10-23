import React from "react";
import { Image, View } from "react-native";

import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";

import { GradientLayers, useSvgId } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { IShareBackground, IShareTemplateId, STORY } from "../../constants";
import { IStoryRun, StoryTemplate } from "../StoryTemplate";

interface IStoryCanvasProps {
	template: IShareTemplateId;
	background: IShareBackground;
	run: IStoryRun;
	// Largura exibida; a arte é desenhada em 1080 × 1920 e reduzida
	width: number;
	// Só a arte (sem o xadrez de transparência) para virar PNG
	canvasRef?: React.RefObject<View | null>;
	// false = só o xadrez (miniatura "Sem fundo")
	hasContent?: boolean;
}

const CHECKER = 16;
// Duas casas escuras por bloco de 16 px (xadrez de transparência)
const CHECKER_PATH = "M0 0h8v8H0z M8 8h8v8H8z";

const createStoryCanvasStyles = (theme: ITheme, width: number) => {
	const height = (width * STORY.height) / STORY.width;
	const scale = width / STORY.width;
	return {
		frame: {
			width,
			height,
			overflow: "hidden" as const,
			backgroundColor: theme.pace.colors.checkerA,
		},
		fill: { position: "absolute" as const, top: 0, left: 0, width, height },
		art: {
			position: "absolute" as const,
			left: (width - STORY.width) / 2,
			top: (height - STORY.height) / 2,
			width: STORY.width,
			height: STORY.height,
			transform: [{ scale }],
		},
		photo: {
			position: "absolute" as const,
			top: 0,
			left: 0,
			width: STORY.width,
			height: STORY.height,
		},
	};
};

// Story montado: fundo (foto, degradê ou transparente) + modelo + logo.
export const StoryCanvas: React.FC<IStoryCanvasProps> = ({
	template,
	background,
	run,
	width,
	canvasRef,
	hasContent = true,
}) => {
	const { theme } = useTheme();
	const { colors, gradients } = theme.pace;
	const patternId = useSvgId("checker");
	const styles = createStoryCanvasStyles(theme, width);

	return (
		<View style={styles.frame}>
			<Svg style={styles.fill} width={styles.fill.width} height={styles.fill.height}>
				<Defs>
					<Pattern id={patternId} width={CHECKER} height={CHECKER} patternUnits="userSpaceOnUse">
						<Path d={CHECKER_PATH} fill={colors.checkerB} />
					</Pattern>
				</Defs>
				<Rect width="100%" height="100%" fill={`url(#${patternId})`} />
			</Svg>
			<View ref={canvasRef} collapsable={false} style={styles.fill}>
				<View style={styles.art}>
					{background.photo ? (
						<>
							<Image source={background.photo} style={styles.photo} resizeMode="cover" />
							<GradientLayers
								layers={gradients.storyPhotoScrim}
								width={STORY.width}
								height={STORY.height}
							/>
						</>
					) : null}
					{background.gradient ? (
						<GradientLayers
							layers={gradients[background.gradient]}
							width={STORY.width}
							height={STORY.height}
						/>
					) : null}
					{hasContent ? <StoryTemplate id={template} run={run} /> : null}
				</View>
			</View>
		</View>
	);
};
