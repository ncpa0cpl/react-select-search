import { InputOption, InputOptionGroup } from "../useSelect";
import { Option } from "./groupOptions";

export function flattenOptions(
  options: Array<InputOption | InputOptionGroup>,
): Array<Option> {
  let index = 0;

  return options.flatMap((option) => {
    if (option.type === "group") {
      return option.items.map(
        (i): Option => ({
          type: "item",
          name: i.name,
          value: i.value,
          group: option.name,
          index: index++,
        }),
      );
    }

    const indexed: Option = {
      name: option.name,
      type: option.type ?? "item",
      value: option.value,
      disabled: option.disabled ?? false,
      index: index++,
    };

    return indexed;
  });
}
