import { Option, OptionGroup } from "./groupOptions";

export const findHighlighted = (
  options: Array<Option | OptionGroup>,
  idx: number,
): Option | null => {
  for (let orderNumber = 0, i = 0; i < options.length; i++) {
    const option = options[i]!;

    if (orderNumber === idx) {
      if (option?.type === "group") {
        return option.items[0]!;
      } else {
        return option;
      }
    }

    if (option?.type === "group") {
      for (let j = 0; j < option.items.length; j++) {
        if (orderNumber === idx) {
          return option.items[j]!;
        }
        orderNumber++;
      }
    } else {
      orderNumber++;
    }
  }

  return null;
};

export function highlight(
  elemIdx: number,
  key: string,
  options: Array<Option | OptionGroup>,
): number {
  const max = options.length - 1;
  let option: null | Option = null;
  let i = -1;
  let highlightIdx = elemIdx;

  while (i++ <= max && (!option || option.disabled)) {
    highlightIdx = key === "down" ? highlightIdx + 1 : highlightIdx - 1;

    if (highlightIdx < 0) {
      highlightIdx = max;
    } else if (highlightIdx > max) {
      highlightIdx = 0;
    }

    option = findHighlighted(options, highlightIdx);
  }

  return highlightIdx;
}
