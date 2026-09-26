export interface SelectOption { value: string; label: string; }
export interface SelectProps {
  label?: string;
  options?: Array<string | SelectOption>;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  helper?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;