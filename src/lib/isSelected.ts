import { Option } from "./groupOptions";

export function isSelected(
  option: Option,
  selectedOption: Option | Array<Option> | null,
): boolean {
  if (!selectedOption) return false;

  return Array.isArray(selectedOption)
    ? selectedOption.findIndex((o) => o.value === option.value) >= 0
    : selectedOption.value === option.value;
}
