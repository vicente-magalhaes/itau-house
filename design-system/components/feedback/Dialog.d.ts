export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Buttons, right-aligned — primary last */
  actions?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  /** Render the panel without the fixed scrim (for docs/previews) */
  inline?: boolean;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element;