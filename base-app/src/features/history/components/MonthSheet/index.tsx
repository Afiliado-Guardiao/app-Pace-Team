import React from "react";
import { View } from "react-native";

import { Button, Sheet } from "@/components/pace";

import { HISTORY_COPY } from "../../constants";
import { IUseHistoryMonthReturn } from "../../hooks/useHistoryMonth";

interface IMonthSheetProps {
	month: IUseHistoryMonthReturn;
}

const styles = { list: { gap: 8 } };

// Calendário do Histórico: os meses que têm corrida (e o mês atual)
export const MonthSheet: React.FC<IMonthSheetProps> = ({ month }) => (
	<Sheet
		open={month.isPickerOpen}
		title={HISTORY_COPY.pickMonth}
		onClose={month.closePicker}
		actions={
			<Button fullWidth variant="ghost" onPress={month.closePicker} testID="history-month-cancel">
				{HISTORY_COPY.cancel}
			</Button>
		}
	>
		<View style={styles.list}>
			{month.options.map((option) => (
				<Button
					key={option.key}
					fullWidth
					variant={option.key === month.selected ? "primary" : "glass"}
					onPress={() => {
						month.pick(option.key);
					}}
					testID={`history-month-${option.key}`}
				>
					{option.label}
				</Button>
			))}
		</View>
	</Sheet>
);
