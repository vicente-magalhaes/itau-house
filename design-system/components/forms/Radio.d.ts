export interface RadioProps {
  label?: React.ReactNode;
  checked?: boolean;
  /** Called with this radio's value */
  onChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;