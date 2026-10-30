export const CREATE_TEAM_COPY = {
	title: "Criar equipe",
	editTitle: "Editar equipe",
	editSubmit: "Salvar alterações",
	country: "País",
	otherCity: "Digite o nome da cidade",
	otherRegion: "Digite a região",
	cityMissing: "Escolha a cidade da equipe (ou digite em Outra).",
	duo: "Dupla",
	otherSize: "Outra",
	otherSizeLabel: "Quantidade de integrantes",
	logo: "Logo",
	logoHint: "Envie o escudo do time. PNG ou JPG quadrado, mínimo 512 px.",
	logoDenied: "Libere o acesso às fotos em Ajustes › PACE TEAM › Fotos.",
	name: "Nome da equipe",
	city: "Cidade",
	region: "Região",
	category: "Categoria",
	members: " integrantes",
	captain: "Capitão",
	preview: "Prévia",
	fallbackName: "Sua equipe",
	fallbackAvatar: "Equipe",
	preparing: "Em preparação",
	progressNote: " integrantes. A equipe entra no campeonato oficial quando estiver completa.",
	submit: "Criar e convidar",
	nameMissing: "Dê um nome para a equipe (pelo menos 2 letras).",
	namePlaceholder: "Ex.: Pace Sharks",
} as const;

// 2 = dupla (casal, amigos); a cidade e a região vêm de @/lib/pace (places)
export const SIZE_OPTIONS = ["2", "3", "5", "10"] as const;
// "Outra": a pessoa escolhe qualquer número de 2 a 50
export const MIN_TEAM_SIZE = 2;
export const MAX_TEAM_SIZE = 50;
export const OTHER_SIZE_OPTIONS = Array.from(
	{ length: MAX_TEAM_SIZE - MIN_TEAM_SIZE + 1 },
	(_, i) => ({
		value: String(i + MIN_TEAM_SIZE),
		label: `${String(i + MIN_TEAM_SIZE)}${CREATE_TEAM_COPY.members}`,
	}),
);
// Só o capitão entrou até agora
export const JOINED = 1;
