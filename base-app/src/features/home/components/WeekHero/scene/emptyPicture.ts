import { Skia, SkPicture } from "@shopify/react-native-skia";

// Quadro vazio (enquanto as imagens carregam)
export const emptyPicture = (): SkPicture => {
	"worklet";
	const recorder = Skia.PictureRecorder();
	recorder.beginRecording(Skia.XYWHRect(0, 0, 1, 1));
	return recorder.finishRecordingAsPicture();
};
