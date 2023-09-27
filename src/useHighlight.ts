import { useState } from "react";
import { Option, OptionGroup } from "./lib/groupOptions";
import { findHighlighted, highlight } from "./lib/highlight";

export type OnSelectCallback = (value: string | number) => void;

export function useHighlight(
  options: Array<Option | OptionGroup>,
  onSelect: OnSelectCallback,
  ref: React.RefObject<HTMLInputElement>,
) {
  const [highlighted, setHighlighted] = useState(-1);

  const keyDownHandler: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const key = e.key.replace("Arrow", "").toLowerCase();

    if (key === "down" || key === "up") {
      e.preventDefault();
      setHighlighted(highlight(highlighted, key, options));
    }
  };

  const keyUpHandler: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      ref.current?.blur();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const highlightedOption = findHighlighted(options, highlighted);
      if (highlightedOption) {
        onSelect(highlightedOption.value);
      }
    }
  };

  return [
    {
      onKeyDown: keyDownHandler,
      onKeyUp: keyUpHandler,
    },
    highlighted,
    setHighlighted,
  ] as const;
}
