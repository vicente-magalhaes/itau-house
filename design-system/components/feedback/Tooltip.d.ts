export interface TooltipProps {
  /** Plain-language explanation, e.g. of a financial term */
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
  /** Force visible (docs/previews) */
  open?: boolean;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;