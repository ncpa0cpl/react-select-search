import { Option } from "./groupOptions";

const isOption: (o: any) => o is Option = Boolean as any;

export function getValue(
  option: null | Option | Array<Option | null>,
): null | string | number | Array<string | number> {
  if (!option) return null;

  if (Array.isArray(option)) {
    return option.filter(isOption).map((o) => o.value);
  }

  return option.value || null;
}
