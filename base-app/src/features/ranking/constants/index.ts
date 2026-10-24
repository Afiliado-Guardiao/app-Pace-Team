export const RANKING_COPY = {
	title: "Ranking",
	week: "Semana 42 · fecha em 2d 14h",
	rules: "Regras",
	city: "Sua cidade",
	worldTitle: "Ranking mundial em breve",
	worldBody: "Ativamos quando houver equipes suficientes em outros países.",
	rulesTitle: "Como pontuamos",
	rulesOk: "Entendi",
	weekPrefix: "Semana ",
	closesIn: " · fecha em ",
	emptyTitle: "Nenhuma equipe nesta categoria ainda",
	emptyBody:
		"Crie a sua equipe ou convide amigos: as primeiras corridas da semana já colocam vocês no ranking.",
} as const;

// "Mundo" sai até existirem equipes em outros países (a Apple recusa itens "em breve")
export const RANKING_SCOPES = ["Cidade", "Região", "Estado", "País"] as const;
export const WORLD_SCOPE = "Mundo";

// Categorias do campeonato (equipes de 3, 5 ou 10)
export const RANKING_CATEGORIES = ["3", "5", "10"] as const;

export const RANKING_RULES = [
	{ icon: "footprints", text: "8 pts por km validado, até 20 km por corrida." },
	{ icon: "calendar", text: "Semana de segunda 00:00 a domingo 23:59." },
	{ icon: "users", text: "Só equipes completas (3, 5 ou 10) entram no campeonato." },
	{ icon: "shield-check", text: "Corridas passam por verificação de GPS, ritmo e sensores." },
] as const;
