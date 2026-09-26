export interface TagProps {
  children?: React.ReactNode;
  /** Filter-chip selected state (preto fill) */
  selected?: boolean;
  onClick?: () => void;
  /** Shows a remove "x" */
  onRemove?: () => void;
  /** Leading Lucide icon */
  icon?: string;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;