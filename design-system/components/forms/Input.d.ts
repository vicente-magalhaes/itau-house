export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helper?: string;
  /** Error message — written as a clear fact, never "Ops!" */
  error?: string;
  disabled?: boolean;
  /** Leading Lucide icon */
  icon?: string;
  type?: string;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;