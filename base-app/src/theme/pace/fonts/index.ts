// Arquivos de fonte do PACE TEAM, carregados pelo useAppInitialization.
// Montserrat na interface; a letra da marca (Inter) já vem no useAppInitialization.
// O design system usa Montserrat variável (woff2); no app nativo
// usamos os TTF por peso do @expo-google-fonts, com os mesmos desenhos.
// Importa peso a peso: o índice do pacote embutiria todas as 18 variações.
import { Kalam_300Light } from "@expo-google-fonts/kalam/300Light";
import { Kalam_400Regular } from "@expo-google-fonts/kalam/400Regular";
import { Montserrat_300Light } from "@expo-google-fonts/montserrat/300Light";
import { Montserrat_400Regular } from "@expo-google-fonts/montserrat/400Regular";
import { Montserrat_500Medium } from "@expo-google-fonts/montserrat/500Medium";
import { Montserrat_600SemiBold } from "@expo-google-fonts/montserrat/600SemiBold";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat/700Bold";
import { Montserrat_800ExtraBold } from "@expo-google-fonts/montserrat/800ExtraBold";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron/400Regular";
import { Orbitron_500Medium } from "@expo-google-fonts/orbitron/500Medium";
import { Orbitron_600SemiBold } from "@expo-google-fonts/orbitron/600SemiBold";

export const paceFontAssets = {
	Montserrat_300Light,
	Montserrat_400Regular,
	Montserrat_500Medium,
	Montserrat_600SemiBold,
	Montserrat_700Bold,
	Montserrat_800ExtraBold,
	// Números do visual novo: Orbitron (zero quadrado cortado, "7Ø.Ø kg")
	Orbitron_400Regular,
	Orbitron_500Medium,
	Orbitron_600SemiBold,
	// Letra de mão das setas do guia e do onboarding
	Kalam_300Light,
	Kalam_400Regular,
};
