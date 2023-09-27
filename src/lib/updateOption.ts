import { Option } from "./groupOptions";
import { isSame } from "./isSame";
import { toArray } from "./toArray";

export function updateOption(
  newOption: Option | null,
  oldOption: Option | Array<Option> | null,
  multiple?: boolean,
): Option | Array<Option> | null {
  if (!newOption) {
    return oldOption;
  }

  if (!multiple) {
    return newOption;
  }

  if (!oldOption) {
    return toArray(newOption);
  }

  const nextOption = toArray(oldOption);
  const newOptionIndex = nextOption.findIndex((o) =>
    isSame(o.value, newOption.value),
  );

  if (newOptionIndex >= 0) {
    nextOption.splice(newOptionIndex, 1);
  } else {
    nextOption.push(newOption);
  }

  return nextOption;
}
