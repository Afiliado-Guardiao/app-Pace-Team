import React from "react";
import { Pressable, Text, View } from "react-native";

import { Icon, Label } from "@/components/pace";
import { useTheme } from "@/theme";

import { useBuddyWardrobe } from "../../hooks/useBuddyWardrobe";
import { MiniBuddy } from "../MiniBuddy";

import { createBuddyWardrobeStyles } from "./styles";

const Lock: React.FC<{ style: object }> = ({ style }) => (
	<View style={style}>
		<Icon name="lock" size={11} strokeWidth={2.2} color="rgba(255,255,255,.8)" />
	</View>
);

// Cores, cores do ranking e acessórios (a folha "Seu Buddy" do design).
export const BuddyWardrobe: React.FC = () => {
	const { theme } = useTheme();
	const sheet = useBuddyWardrobe();
	const styles = createBuddyWardrobeStyles(theme);

	return (
		<>
			<View style={styles.section}>
				<Label>Cor do Buddy</Label>
				<View style={styles.grid(6)}>
					{sheet.colors.map((c) => (
						<Pressable
							key={c.id}
							testID={`buddy-color-${c.id}`}
							accessibilityLabel={c.name}
							onPress={() => {
								sheet.pickColor(c);
							}}
							style={styles.cell(sheet.cells.color, c.isSelected, 1)}
						>
							<MiniBuddy color={c.id} accessories={[]} scale={0.36} />
							<Text style={styles.name(10)}>{c.name}</Text>
						</Pressable>
					))}
				</View>
			</View>
			<View style={styles.section}>
				<Label>Cores do ranking</Label>
				<View style={styles.grid(6)}>
					{sheet.tierColors.map((c) => (
						<Pressable
							key={c.id}
							testID={`buddy-color-${c.id}`}
							accessibilityLabel={c.name}
							onPress={() => {
								sheet.pickColor(c);
							}}
							style={styles.cell(sheet.cells.tier, c.isSelected, c.isLocked ? 0.55 : 1)}
						>
							<MiniBuddy color={c.id} accessories={[]} scale={0.36} isDim={c.isLocked} />
							<Text style={styles.name(10.5)}>{c.name}</Text>
							<Text style={styles.sub(9.5)}>{c.sub}</Text>
							{c.isLocked ? <Lock style={styles.lock} /> : null}
						</Pressable>
					))}
				</View>
				<Text style={styles.note}>
					Só libera a cor do seu nível atual no ranking semanal. Caiu de nível, o Buddy volta pra
					sua cor normal.
				</Text>
			</View>
			<View style={styles.section}>
				<Label>Acessórios</Label>
				<View style={styles.grid(8)}>
					{sheet.accItems.map((a) => (
						<Pressable
							key={a.id}
							testID={`buddy-acc-${a.id}`}
							accessibilityLabel={a.name}
							onPress={() => {
								sheet.equip(a);
							}}
							style={[
								styles.cell(sheet.cells.acc, a.isWorn, a.isLocked ? 0.6 : 1),
								{ borderRadius: 18, paddingTop: 6, paddingBottom: 9 },
							]}
						>
							<MiniBuddy
								color={sheet.color}
								accessories={a.id === "base" ? [] : [a.id]}
								isDim={a.isLocked}
							/>
							<Text style={styles.name(11)}>{a.name}</Text>
							<Text style={styles.sub(10)}>{a.req}</Text>
							{a.isLocked ? <Lock style={styles.lock} /> : null}
						</Pressable>
					))}
				</View>
			</View>
		</>
	);
};
