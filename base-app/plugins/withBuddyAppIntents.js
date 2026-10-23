// Coloca no alvo principal do app (não no widget) o código Swift que só pode
// existir nele: o atalho "Chamar Pace Buddy" (App Shortcuts, usado pelo Toque
// Traseiro), o despertador (AlarmKit) e a ponte com o módulo PaceBuddy.
// Os arquivos ficam em native/ios/app e são copiados a cada prebuild.
const fs = require("fs");
const path = require("path");

const { IOSConfig, withDangerousMod, withXcodeProject } = require("expo/config-plugins");

const SOURCE_DIR = path.join("native", "ios", "app");

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
		return c;
	});

module.exports = (config) => withSourcesInAppTarget(withCopiedFiles(config));
