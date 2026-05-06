export interface IErrorModalProps {
	visible: boolean;
	title?: string;
	message: string;
	onClose: () => void;
	confirmText?: string;
}
