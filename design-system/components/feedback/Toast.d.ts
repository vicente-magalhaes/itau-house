export interface ToastProps {
  tone?: 'neutral' | 'success' | 'brand' | 'error';
  /** Short, factual copy — "Pix enviado." not "Eba!!!" */
  children?: React.ReactNode;
  action?: string;
  onAction?: () => void;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;