import React from "react";
import { View } from "react-native";

import { createCustomModalStyles } from "./styles";
import { ICustomModalProps } from "./types";

export const CustomModal: React.FC<ICustomModalProps> = ({ content }) => {
	const styles = createCustomModalStyles();

	return <View style={styles.container}>{content}</View>;
};
