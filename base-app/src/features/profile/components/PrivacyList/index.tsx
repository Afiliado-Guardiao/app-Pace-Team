import React from "react";
import { View } from "react-native";

import { Switch } from "@/components/pace";

import { PRIVACY_SWITCHES } from "../../constants";

const LIST = { gap: 16, marginTop: 4 } as const;

// Preferências de privacidade dentro da folha "Privacidade".
export const PrivacyList: React.FC = () => (
	<View style={LIST}>
		{PRIVACY_SWITCHES.map((s, i) => (
			<Switch
				key={s.label}
				label={s.label}
				defaultChecked={s.isOn}
				testID={`privacy-${String(i)}`}
			/>
		))}
	</View>
);
