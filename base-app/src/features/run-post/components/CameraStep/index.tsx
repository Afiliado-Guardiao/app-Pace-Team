import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import { CameraView } from "expo-camera";

import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/pace";
import { PostArt } from "@/components/shared/PostArt";
import { useTheme } from "@/theme";

import { POST_COPY, POST_PHOTOS } from "../../constants";
import { IUseRunPostReturn } from "../../hooks/useRunPost";
import { GlassCircleButton } from "../GlassCircleButton";

import { createCameraStepStyles } from "./styles";

interface ICameraStepProps {
	post: IUseRunPostReturn;
}

// Etapa 1: câmera com a arte da marca por cima e fotos de exemplo.
export const CameraStep: React.FC<ICameraStepProps> = ({ post }) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const styles = createCameraStepStyles(theme, insets);

	return (
		<View style={styles.root}>
			<View style={styles.frame}>
				{post.isLive ? (
					<View style={styles.live}>
						<CameraView
							ref={post.cameraRef}
							style={styles.fill}
							facing={post.facing}
							flash={post.isFlashOn ? "on" : "off"}
						/>
						<View style={styles.fill} pointerEvents="none">
							<PostArt seconds={post.run.seconds} km={post.run.km} team={post.team} />
						</View>
					</View>
				) : (
					<PostArt
						image={post.image}
						seconds={post.run.seconds}
						km={post.run.km}
						team={post.team}
					/>
				)}
			</View>
			<View style={styles.topBar}>
				<GlassCircleButton
					icon="x"
					iconSize={19}
					label={POST_COPY.close}
					onPress={post.close}
					testID="post-close"
				/>
				<Text style={styles.title}>{POST_COPY.cameraTitle}</Text>
				<GlassCircleButton
					icon={post.isFlashOn ? "zap" : "zap-off"}
					label={POST_COPY.flash}
					onPress={post.toggleFlash}
					testID="post-flash"
				/>
			</View>
			<View style={styles.bottom}>
				<View style={styles.thumbs}>
					<Pressable
						onPress={post.pickGallery}
						accessibilityRole="button"
						accessibilityLabel={POST_COPY.gallery}
						testID="post-gallery"
						style={[styles.thumb, styles.thumbIcon]}
					>
						<Icon name="images" size={16} />
					</Pressable>
					{POST_PHOTOS.map((photo, i) => (
						<Pressable
							key={`photo-${String(i)}`}
							onPress={() => {
								post.selectSample(i);
							}}
							accessibilityRole="button"
							accessibilityLabel={`${POST_COPY.photo}${String(i + 1)}`}
							testID={`post-photo-${String(i)}`}
							style={[styles.thumb, i === post.selectedSample ? styles.thumbOn : null]}
						>
							<Image source={photo} style={styles.thumbImage} />
						</Pressable>
					))}
				</View>
				<Pressable
					onPress={post.shoot}
					accessibilityRole="button"
					accessibilityLabel={POST_COPY.shoot}
					testID="post-shoot"
					style={styles.shutter}
				>
					<View style={styles.shutterInner} />
				</Pressable>
				<GlassCircleButton
					icon="refresh-cw"
					label={POST_COPY.flip}
					onPress={post.flip}
					testID="post-flip"
				/>
			</View>
			<Animated.View style={[styles.flash, post.flashStyle]} pointerEvents="none" />
		</View>
	);
};
