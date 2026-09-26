export interface LogoProps {
  /** Rendered edge in px; clamped to the 30px digital minimum. */
  size?: number;
  /** positive = laranja (on white/black); negative = branco (on orange or complementary colors) */
  variant?: 'positive' | 'negative';
  /** Path prefix to the design-system root, e.g. "../../" */
  basePath?: string;
  style?: React.CSSProperties;
}
export declare function Logo(props: LogoProps): JSX.Element;