import React from "react";

import { Button, Sheet } from "@/components/pace";
import { formatDistance, formatDurationText } from "@/lib/pace";

import { RUN_LIVE_COPY as C } from "../../constants";

interface IFinishSheetProps {
	open: boolean;
	km: number;
	seconds: number;
	onClose: () => void;
	onFinish: () => void;
	onResume: () => void;
}

// Confirma antes de encerrar a corrida
export const FinishSheet: React.FC<IFinishSheetProps> = ({
	open,
	km,
	seconds,
	onClose,
	onFinish,
	onResume,
}) => (
	<Sheet
		open={open}
		title={C.confirmTitle}
		onClose={onClose}
		actions={
			<>
				<Button fullWidth size="lg" onPress={onFinish} testID="run-finish">
					{C.confirmSave}
				</Button>
				<Button fullWidth variant="ghost" onPress={onResume}>
					{C.confirmKeep}
				</Button>
			</>
		}
	>
		{`${formatDistance(km)}${C.confirmBody}${formatDurationText(seconds)}${C.confirmNote}`}
	</Sheet>
);
