import React from "react";
import { Image, View } from "react-native";

import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

import { useSvgId } from "@/components/pace";

import runnerPhoto from "../../../../../assets/home/panel-runner.jpg";

import { PANEL } from "./constants";
import { createHomePanelStyles } from "./styles";

interface IPanelAcrylicProps {
	width: number;
	height: number;
}

// Fundo do card de acrílico, de trás para frente: cor base, foto laranja
// desfocada, sombra para leitura e o brilho do acrílico no canto de cima
export const PanelAcrylic: React.FC<IPanelAcrylicProps> = ({ width, height }) => {
	const id = useSvgId("hp-acrylic");
	const styles = createHomePanelStyles({ width, height });

	return (
		<View style={styles.acrylic} pointerEvents="none">
			<Image
				source={runnerPhoto}
				style={styles.photo}
				blurRadius={PANEL.photoBlur}
				resizeMode="cover"
			/>
			<View style={styles.dim} />
			{width > 0 ? (
				<Svg width={width} height={height} style={styles.layer}>
					<Defs>
						<LinearGradient id={`${id}d`} x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor="rgb(40,10,0)" stopOpacity={0.18} />
							<Stop offset="0.55" stopColor="rgb(30,8,0)" stopOpacity={0.32} />
							<Stop offset="1" stopColor="rgb(12,4,0)" stopOpacity={0.62} />
						</LinearGradient>
						<RadialGradient id={`${id}s`} cx="0.2" cy="0" rx="0.9" ry="0.6" fx="0.2" fy="0">
							<Stop offset="0" stopColor="#fff" stopOpacity={0.16} />
							<Stop offset="0.6" stopColor="#fff" stopOpacity={0} />
						</RadialGradient>
					</Defs>
					<Rect width={width} height={height} fill={`url(#${id}d)`} />
					<Rect width={width} height={height} fill={`url(#${id}s)`} />
				</Svg>
			) : null}
		</View>
	);
};
