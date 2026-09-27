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
  /** Altura do campo: 'md' (48px, padrao) ou 'sm' (40px, para barras densas) */
  size?: 'md' | 'sm';
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;