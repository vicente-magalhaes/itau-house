export interface BadgeProps {
  tone?: 'brand' | 'neutral' | 'dark' | 'success' | 'info' | 'warning';
  /** Render as a 10px status dot */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;