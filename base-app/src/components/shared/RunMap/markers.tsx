import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import { Avatar } from "@/components/pace";
import { useTheme } from "@/theme";

import { createRunMapStyles } from "./styles";

// Marcadores do mapa (.pt-start, .pt-end, .pt-me, .pt-friend, .pt-region)

export const StartPin: React.FC = () => {
	const { theme } = useTheme();
	return <View style={createRunMapStyles(theme).startPin} />;
};

export const EndPin: React.FC = () => {
	const { theme } = useTheme();
	return <View style={createRunMapStyles(theme).endPin} />;
};

export const MePin: React.FC = () => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	return (
		<View style={styles.meHalo}>
			<View style={styles.meDot} />
		</View>
	);
};

// Colega no mapa: foto do perfil (ou as iniciais, sem foto) e o rótulo
export const FriendPin: React.FC<{ image?: ImageSourcePropType; name: string; label: string }> = ({
	image,
	name,
	label,
}) => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	return (
		<View style={styles.friend}>
			{image ? (
				<Image source={image} style={styles.friendPhoto} />
			) : (
				<Avatar name={name} size={styles.friendPhoto.width as number} ring />
			)}
			<View style={styles.friendLabel}>
				<Text style={styles.friendText}>{label}</Text>
			</View>
		</View>
	);
};

export const RegionLabel: React.FC<{ count: string; label: string }> = ({ count, label }) => {
	const { theme } = useTheme();
	const styles = createRunMapStyles(theme);
	return (
		<View style={styles.region}>
			<Text style={styles.regionCount}>{count}</Text>
			<Text style={styles.regionText}>{label}</Text>
		</View>
	);
};
