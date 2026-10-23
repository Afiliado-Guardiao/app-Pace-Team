import React from "react";

import { CameraStep } from "./components/CameraStep";
import { EditStep } from "./components/EditStep";
import { useRunPost } from "./hooks/useRunPost";

// 06d Postar a corrida: câmera → edição → feed do Início.
export const RunPostScreen: React.FC = () => {
	const post = useRunPost();

	return post.step === "camera" ? <CameraStep post={post} /> : <EditStep post={post} />;
};
