import React from "react";
import { View } from "react-native";

import { Switch } from "@/components/pace";
import { IPrivacySettings } from "@/lib/supabase";

import { PRIVACY_SWITCHES } from "../../constants";

interface IPrivacyListProps {
	values: IPrivacySettings;
	onToggle: (key: keyof IPrivacySettings, value: boolean) => void;
}

const LIST = { gap: 16, marginTop: 4 } as const;

// Preferências de privacidade dentro da folha "Privacidade" (salvas no perfil).
export const PrivacyList: React.FC<IPrivacyListProps> = ({ values, onToggle }) => (
	<View style={LIST}>
		{PRIVACY_SWITCHES.map((s, i) => (
			<Switch
				key={s.key}
				label={s.label}
				checked={values[s.key]}
				onChange={(value) => {
					onToggle(s.key, value);
				}}
				testID={`privacy-${String(i)}`}
			/>
		))}
	</View>
);
