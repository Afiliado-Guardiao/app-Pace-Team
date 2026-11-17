// Coloca no alvo principal do app (não no widget) o código Swift que só pode
// existir nele: o atalho "Chamar Pace Buddy" (App Shortcuts, usado pelo Toque
// Traseiro), o despertador (AlarmKit) e a ponte com o módulo PaceBuddy.
// Os arquivos ficam em native/ios/app e são copiados a cada prebuild.
const fs = require("fs");
const path = require("path");

const { IOSConfig, withDangerousMod, withXcodeProject } = require("expo/config-plugins");

const SOURCE_DIR = path.join("native", "ios", "app");

// Sons do cartão do Buddy (o cartão aparece / um botão o fecha)
const SOUND_DIR = path.join(SOURCE_DIR, "sounds");
const soundFiles = (projectRoot) => {
	const dir = path.join(projectRoot, SOUND_DIR);
	return fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".wav")) : [];
};

// Arte do novo Bud e dos itens do Studio para o cartão do Buddy (no widget elas
// vêm do catálogo do alvo; aqui, como arquivos do pacote: UIImage(named:))
const BUD_PARTS = {
	bud_body: "body",
	bud_hand_l: "handL",
	bud_hand_r: "handR",
	bud_hand_l_full: "handLFull",
	bud_hand_r_full: "handRFull",
	bud_body_dark: "bodyDark",
	bud_hand_l_dark: "handLDark",
	bud_hand_r_dark: "handRDark",
	bud_hand_l_full_dark: "handLFullDark",
	bud_hand_r_full_dark: "handRFullDark",
};
const artFiles = (projectRoot) => {
	const bud = Object.entries(BUD_PARTS).map(([name, file]) => ({
		from: path.join(projectRoot, "assets", "bud", `${file}.png`),
		name: `${name}.png`,
	}));
	const studioDir = path.join(projectRoot, "assets", "studio");
	const studio = fs
		.readdirSync(studioDir)
		.filter((f) => f.endsWith(".png"))
		.map((f) => ({
			from: path.join(studioDir, f),
			name: `studio_${f.replace(/-/g, "_")}`,
		}));
	return [...bud, ...studio];
};

const swiftFiles = (projectRoot) =>
	fs.readdirSync(path.join(projectRoot, SOURCE_DIR)).filter((f) => f.endsWith(".swift"));

const withCopiedFiles = (config) =>
	withDangerousMod(config, [
		"ios",
		(c) => {
			const { projectRoot, platformProjectRoot } = c.modRequest;
			const projectName = IOSConfig.XcodeUtils.getProjectName(projectRoot);
			for (const file of swiftFiles(projectRoot)) {
				fs.copyFileSync(
					path.join(projectRoot, SOURCE_DIR, file),
					path.join(platformProjectRoot, projectName, file),
				);
			}
			for (const file of soundFiles(projectRoot)) {
				fs.copyFileSync(
					path.join(projectRoot, SOUND_DIR, file),
					path.join(platformProjectRoot, projectName, file),
				);
			}
			for (const art of artFiles(projectRoot)) {
				fs.copyFileSync(art.from, path.join(platformProjectRoot, projectName, art.name));
			}
			return c;
		},
	]);

const withSourcesInAppTarget = (config) =>
	withXcodeProject(config, (c) => {
		const projectName = IOSConfig.XcodeUtils.getProjectName(c.modRequest.projectRoot);
		for (const file of swiftFiles(c.modRequest.projectRoot)) {
			IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
				filepath: path.posix.join(projectName, file),
				groupName: projectName,
				project: c.modResults,
			});
		}
		const resources = [
			...soundFiles(c.modRequest.projectRoot),
			...artFiles(c.modRequest.projectRoot).map((a) => a.name),
		];
		for (const file of resources) {
			IOSConfig.XcodeUtils.addResourceFileToGroup({
				filepath: path.posix.join(projectName, file),
				groupName: projectName,
				project: c.modResults,
				isBuildFile: true,
			});
		}
		return c;
	});

// As frases da Siri ("E aí Siri, chama o Bud") são escritas em português no
// Swift. O iOS registra essas frases no idioma de desenvolvimento do projeto,
// então ele precisa ser pt-BR (o padrão do Expo é en, e a Siri em português
// não acharia as frases).
const DEV_REGION = "pt-BR";

const withPortugueseDevRegion = (config) =>
	withXcodeProject(config, (c) => {
		const project = c.modResults.getFirstProject().firstProject;
		project.developmentRegion = DEV_REGION;
		const regions = project.knownRegions ?? [];
		if (!regions.includes(`"${DEV_REGION}"`) && !regions.includes(DEV_REGION)) {
			project.knownRegions = [...regions, `"${DEV_REGION}"`];
		}
		return c;
	});

module.exports = (config) =>
	withPortugueseDevRegion(withSourcesInAppTarget(withCopiedFiles(config)));
