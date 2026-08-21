/*
 * @@description:
 */
export interface SelectTagDataProps {
  label: string;
  type: string;
  component: string;
  selectType: number;
  dropdownItems: { label: string; value: string | number }[];
}
