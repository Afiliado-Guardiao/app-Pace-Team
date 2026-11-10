import React from "react";
import { Pressable, Text, View } from "react-native";

import { BUDDY_H, BUDDY_W, BuddyFigure, IBuddyPose, MiniBuddy } from "@/components/buddy";
import { Button, Icon } from "@/components/pace";
import { ITheme, useTheme } from "@/theme";

import { SETUP_ACCESSORIES, SETUP_COPY as C } from "../../constants";
import { useStepAcc } from "../../hooks/useStepAcc";
import { SubDots } from "../SubDots";

interface IStepAccProps {
	onDone: () => void;
}

const BIG = 160 / BUDDY_W;
const PEDESTAL = 210;
const MINI = 54 / BUDDY_W;
const POSE: IBuddyPose = { act: "idle", phase: null, blink: false, gx: 0, gy: 0 };

const createStepAccStyles = (theme: ITheme) => {
	const { colors, spacing, typography, radii } = theme.pace;
	return {
		root: { gap: spacing[4] },
		head: { gap: spacing[1] },
		title: {
			fontFamily: typography.fonts.extrabold,
			fontSize: 26,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		sub: {
			fontFamily: typography.fonts.medium,
			fontSize: typography.sizes.ui,
			color: colors.textSecondary,
			textAlign: "center" as const,
		},
		stage: {
			alignSelf: "center" as const,
			width: PEDESTAL,
			height: PEDESTAL,
			alignItems: "center" as const,
			justifyContent: "center" as const,
		},
		ring: {
			position: "absolute" as const,
			width: PEDESTAL,
			height: PEDESTAL,
			borderRadius: PEDESTAL / 2,
			borderWidth: 1.5,
			borderStyle: "dashed" as const,
			borderColor: colors.accentBorderSoft,
			backgroundColor: colors.accentSoft,
		},
		big: { width: BUDDY_W * BIG, height: BUDDY_H * BIG },
		bigInner: {
			position: "absolute" as const,
			transform: [{ scale: BIG }],
			transformOrigin: "0% 0%",
		},
		chip: {
			alignSelf: "center" as const,
			flexDirection: "row" as const,
			alignItems: "center" as const,
			gap: 6,
			paddingHorizontal: spacing[3],
			paddingVertical: 6,
			borderRadius: radii.pill,
			backgroundColor: colors.statusSuccessSoft,
		},
		chipText: {
			fontFamily: typography.fonts.bold,
			fontSize: typography.sizes.xs,
			color: colors.statusSuccess,
		},
		grid: {
			flexDirection: "row" as const,
			flexWrap: "wrap" as const,
			justifyContent: "space-between" as const,
			rowGap: spacing[3],
		},
		cell: {
			width: "23%" as const,
			alignItems: "center" as const,
			gap: 4,
			paddingVertical: spacing[2],
			borderRadius: radii.lg,
			borderWidth: 1,
			borderColor: colors.glassBorder,
			backgroundColor: colors.glass1,
		},
		cellOn: { borderColor: colors.accentBorderSoft, backgroundColor: colors.accentSoft },
		cellCrown: { borderColor: colors.semantic.gold },
		lock: { position: "absolute" as const, top: 4, right: 4 },
		name: {
			fontFamily: typography.fonts.bold,
			fontSize: 10.5,
			color: colors.textPrimary,
			textAlign: "center" as const,
		},
		note: {
			fontFamily: typography.fonts.semibold,
			fontSize: typography.sizes.xs,
			color: colors.textTertiary,
			textAlign: "center" as const,
		},
		noteFlash: { color: colors.semantic.gold },
		gold: colors.semantic.gold,
		ok: colors.statusSuccess,
	};
};

// 3a · "Agora somos parceiros!": o primeiro acessório cai na cabeça do Buddy
export const StepAcc: React.FC<IStepAccProps> = ({ onDone }) => {
	const { theme } = useTheme();
	const styles = createStepAccStyles(theme);
	const acc = useStepAcc(onDone);
	const isFlashing = acc.crownFlash % 2 === 1;

	return (
		<View style={styles.root}>
			<View style={styles.head}>
				<Text style={styles.title}>{C.accTitle}</Text>
				<Text style={styles.sub}>{C.accSub}</Text>
			</View>
			<View style={styles.stage}>
				<View style={styles.ring} />
				<View style={styles.big} pointerEvents="none">
					<View style={styles.bigInner} key={acc.dropKey}>
						<BuddyFigure
							pose={POSE}
							color="branco"
							accessories={[acc.selected]}
							dropId={acc.selected}
						/>
					</View>
				</View>
			</View>
			<View style={styles.chip}>
				<Icon name="check" size={14} color={styles.ok} />
				<Text style={styles.chipText}>{`${acc.selectedName}${C.accEquipped}`}</Text>
			</View>
			<View style={styles.grid}>
				{SETUP_ACCESSORIES.map((item) => (
					<Pressable
						key={item.id}
						onPress={() => {
							acc.pick(item.id);
						}}
						style={[
							styles.cell,
							item.id === acc.selected ? styles.cellOn : null,
							item.id === "coroa" ? styles.cellCrown : null,
						]}
						accessibilityRole="button"
						accessibilityLabel={item.name}
						testID={`setup-acc-${item.id}`}
					>
						<MiniBuddy
							color="branco"
							accessories={[item.id]}
							scale={MINI}
							isDim={item.id === "coroa"}
						/>
						{item.id === "coroa" ? (
							<View style={styles.lock}>
								<Icon name="lock" size={12} color={styles.gold} />
							</View>
						) : null}
						<Text style={styles.name} numberOfLines={2}>
							{item.name}
						</Text>
					</Pressable>
				))}
			</View>
			<Text style={[styles.note, isFlashing ? styles.noteFlash : null]}>{C.accCrown}</Text>
			<SubDots index={0} />
			<Button
				size="lg"
				fullWidth
				iconRight="chevron-right"
				onPress={acc.confirm}
				testID="setup-acc-cta"
			>
				{C.accCta}
			</Button>
		</View>
	);
};
