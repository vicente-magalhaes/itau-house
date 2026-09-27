export interface TabItem { value: string; label: string; }
export interface TabsProps {
  items?: Array<string | TabItem>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Liga as abas ao painel: cada botao ganha id `${idPrefix}-tab-${value}` e aria-controls `${idPrefix}-painel-${value}` */
  idPrefix?: string;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;