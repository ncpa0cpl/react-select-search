export type Option = {
  type: "item";
  name: string;
  value: string | number;
  disabled?: boolean;
  group?: string;
  index: number;
};

export type OptionGroup = {
  type: "group";
  name: string;
  items: Option[];
};

export function groupOptions(
  options: Array<Option>,
): Array<Option | OptionGroup> {
  const nextOptions: Array<Option | OptionGroup> = [];

  for (let i = 0; i < options.length; i++) {
    const option = options[i]!;

    if (option.group) {
      const group = nextOptions.find(
        (o): o is OptionGroup => o.type === "group" && o.name === option.group,
      );

      if (group) {
        group.items.push(option);
      } else {
        nextOptions.push({
          items: [option],
          type: "group",
          name: option.group,
        });
      }
    } else {
      nextOptions.push(option);
    }
  }

  return nextOptions;
}
