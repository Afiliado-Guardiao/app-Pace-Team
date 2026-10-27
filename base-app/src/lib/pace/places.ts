// Países, cidades e regiões para criar e editar a equipe. "Outra" deixa o
// atleta escrever o nome quando a cidade ou a região não está na lista.
export const OTHER_PLACE = "Outra";

export interface ICountry {
	code: string;
	name: string;
	cities: readonly string[];
	regions: readonly string[];
}

const GENERIC_REGIONS = [
	"Centro",
	"Zona Norte",
	"Zona Sul",
	"Zona Leste",
	"Zona Oeste",
	"Região metropolitana",
	"Interior",
	"Litoral",
] as const;

const BR_CITIES = [
	"São Paulo",
	"Rio de Janeiro",
	"Belo Horizonte",
	"Brasília",
	"Salvador",
	"Fortaleza",
	"Recife",
	"Curitiba",
	"Porto Alegre",
	"Manaus",
	"Belém",
	"Goiânia",
	"Florianópolis",
	"Vitória",
	"Natal",
	"João Pessoa",
	"Maceió",
	"Aracaju",
	"Teresina",
	"São Luís",
	"Cuiabá",
	"Campo Grande",
	"Palmas",
	"Porto Velho",
	"Rio Branco",
	"Macapá",
	"Boa Vista",
	"Campinas",
	"Valinhos",
	"Vinhedo",
	"Paulínia",
	"Sumaré",
	"Hortolândia",
	"Indaiatuba",
	"Jundiaí",
	"Americana",
	"Piracicaba",
	"Sorocaba",
	"Ribeirão Preto",
	"São José dos Campos",
	"Taubaté",
	"Santos",
	"Guarujá",
	"Praia Grande",
	"Santo André",
	"São Bernardo do Campo",
	"São Caetano do Sul",
	"Guarulhos",
	"Osasco",
	"Barueri",
	"Bauru",
	"São José do Rio Preto",
	"Londrina",
	"Maringá",
	"Joinville",
	"Blumenau",
	"Caxias do Sul",
	"Niterói",
	"Juiz de Fora",
	"Uberlândia",
	"Contagem",
	"Feira de Santana",
] as const;

const BR_REGIONS = [
	"Capital",
	...GENERIC_REGIONS,
	"RMC",
	"ABC Paulista",
	"Baixada Santista",
	"Vale do Paraíba",
	"Grande SP",
	"Grande Rio",
] as const;

export const COUNTRIES: readonly ICountry[] = [
	{ code: "BR", name: "Brasil", cities: BR_CITIES, regions: BR_REGIONS },
	{
		code: "PT",
		name: "Portugal",
		cities: ["Lisboa", "Porto", "Braga", "Coimbra", "Faro", "Aveiro", "Funchal", "Setúbal"],
		regions: ["Grande Lisboa", "Grande Porto", "Norte", "Centro", "Algarve", "Madeira", "Açores"],
	},
	{
		code: "US",
		name: "Estados Unidos",
		cities: [
			"Nova York",
			"Miami",
			"Orlando",
			"Boston",
			"Los Angeles",
			"San Francisco",
			"Chicago",
			"Houston",
			"Austin",
			"Seattle",
		],
		regions: GENERIC_REGIONS,
	},
	{
		code: "AR",
		name: "Argentina",
		cities: ["Buenos Aires", "Córdoba", "Rosário", "Mendoza", "La Plata", "Mar del Plata"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "UY",
		name: "Uruguai",
		cities: ["Montevidéu", "Punta del Este", "Salto", "Colônia do Sacramento"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "PY",
		name: "Paraguai",
		cities: ["Assunção", "Ciudad del Este", "Encarnación"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "CL",
		name: "Chile",
		cities: ["Santiago", "Valparaíso", "Viña del Mar", "Concepción"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "MX",
		name: "México",
		cities: ["Cidade do México", "Guadalajara", "Monterrey", "Cancún", "Puebla"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "CO",
		name: "Colômbia",
		cities: ["Bogotá", "Medellín", "Cali", "Cartagena", "Barranquilla"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "ES",
		name: "Espanha",
		cities: ["Madri", "Barcelona", "Valência", "Sevilha", "Málaga", "Bilbao"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "IT",
		name: "Itália",
		cities: ["Roma", "Milão", "Nápoles", "Turim", "Florença", "Bolonha"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "FR",
		name: "França",
		cities: ["Paris", "Lyon", "Marselha", "Toulouse", "Nice", "Bordeaux"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "DE",
		name: "Alemanha",
		cities: ["Berlim", "Munique", "Hamburgo", "Frankfurt", "Colônia"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "GB",
		name: "Reino Unido",
		cities: ["Londres", "Manchester", "Liverpool", "Edimburgo", "Birmingham"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "CA",
		name: "Canadá",
		cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
		regions: GENERIC_REGIONS,
	},
	{
		code: "JP",
		name: "Japão",
		cities: ["Tóquio", "Osaka", "Quioto", "Nagoia", "Yokohama"],
		regions: GENERIC_REGIONS,
	},
];

// País da lista (ou um país sem lista própria: só "Outra" para escrever)
export const countryOf = (code: string): ICountry =>
	COUNTRIES.find((c) => c.code === code) ?? {
		code,
		name: code,
		cities: [],
		regions: GENERIC_REGIONS,
	};

// Opções com a cidade do atleta primeiro e "Outra" no fim
export const placeOptions = (list: readonly string[], first?: string | null): string[] => [
	...new Set([first, ...list].filter((c): c is string => Boolean(c && c !== OTHER_PLACE))),
	OTHER_PLACE,
];

// Cidades e estados oferecidos no cadastro e no "Editar perfil" (o ranking da
// cidade compara o nome exato, por isso a escolha é por lista).
export const CITIES: string[] = [...BR_CITIES];
export const STATES = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PA",
	"PB",
	"PR",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SP",
	"SE",
	"TO",
];
