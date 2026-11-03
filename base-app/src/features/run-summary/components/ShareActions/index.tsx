import React from "react";
import { View } from "react-native";

import { Button } from "@/components/pace";

import { RUN_SUMMARY_COPY } from "../../constants";

interface IShareActionsProps {
	onShare: () => void;
	onPost: () => void;
}

const styles = {
	row: { flexDirection: "row" as const, gap: 10 },
	action: { flex: 1 },
};

// Compartilhar a arte da corrida ou postar no feed da equipe
export const ShareActions: React.FC<IShareActionsProps> = ({ onShare, onPost }) => (
	<View style={styles.row}>
		<Button
			variant="glass"
			icon="share-2"
			style={styles.action}
			onPress={onShare}
			testID="run-summary-share"
		>
			{RUN_SUMMARY_COPY.share}
		</Button>
		<Button
			variant="glass"
			icon="camera"
			style={styles.action}
			onPress={onPost}
			testID="run-summary-post"
		>
			{RUN_SUMMARY_COPY.post}
		</Button>
	</View>
);
