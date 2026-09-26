/**
 * Content container: white with hairline, subtle gray, solid Laranja or preto fields.
 */
export interface CardProps {
  tone?: 'default' | 'subtle' | 'brand' | 'inverse';
  padding?: number;
  /** Lifts on hover */
  interactive?: boolean;
  onClick?: () => void;
  /** Top image URL (warm, natural-light photography) */
  image?: string;
  imageHeight?: number;
  /** Spaced-caps overline, e.g. "CARTÕES" */
  eyebrow?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;