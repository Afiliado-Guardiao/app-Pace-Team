/* global require */
// Entrada da prévia web: o Skia do navegador (CanvasKit) carrega antes do app,
// porque o "Sua semana" do Início desenha com ele já na importação. O arquivo
// public/canvaskit.wasm é copiado de node_modules só na máquina da prévia.
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

void LoadSkiaWeb({ locateFile: (file) => `/${file}` }).then(() => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports -- só depois do Skia
	require("expo-router/entry");
});
