import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/server.ts"],
	format: ["cjs"],
	target: "node22",
	outDir: "dist",
	clean: true,
	sourcemap: true,
	minify: process.env.NODE_ENV === "production",
	splitting: false,
	treeshake: true,
	dts: false,
	external: ["@prisma/client", ".prisma/client"],
	noExternal: [],
	platform: "node",
	shims: false,
	skipNodeModulesBundle: true,
});
