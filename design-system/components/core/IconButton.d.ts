export interface IconButtonProps {
  /** Lucide icon name */
  icon: string;
  /** Required accessible label (pt-BR) */
  label: string;
  variant?: 'ghost' | 'filled' | 'subtle' | 'inverse';
  size?: number;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;