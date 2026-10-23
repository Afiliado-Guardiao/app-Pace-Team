import { useCallback, useEffect, useState } from "react";

// O Safari do iPhone só toca um vídeo por endereço se o servidor responder
// em pedaços (Range); o servidor da prévia por link entrega o arquivo
// inteiro. Baixamos o vídeo uma vez e tocamos a cópia local (blob:).
const blobs = new Map<string, Promise<string>>();

const loadBlob = (uri: string): Promise<string> => {
	const cached = blobs.get(uri);
	if (cached) return cached;
	const pending = fetch(uri)
		.then((r) => {
			if (!r.ok) throw new Error(`video_${String(r.status)}`);
			return r.blob();
		})
		.then((blob) => URL.createObjectURL(blob));
	blobs.set(uri, pending);
	pending.catch(() => blobs.delete(uri));
	return pending;
};

interface IUseVideoBlobReturn {
	src: string | undefined;
	// Se a cópia local falhar no player, volta para o endereço original
	onError: () => void;
}

export const useVideoBlob = (uri: string | undefined): IUseVideoBlobReturn => {
	const [src, setSrc] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (!uri) return;
		let active = true;
		loadBlob(uri)
			.then((blobUrl) => {
				if (active) setSrc(blobUrl);
			})
			.catch(() => {
				if (active) setSrc(uri);
			});
		return () => {
			active = false;
		};
	}, [uri]);

	const onError = useCallback(() => {
		setSrc((current) => (current?.startsWith("blob:") ? uri : current));
	}, [uri]);

	return { src, onError };
};
