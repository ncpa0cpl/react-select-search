/* eslint-disable react/prop-types */
import clsx from "clsx";
import React, { memo } from "react";
import { BASE_CLASS } from "../SelectSearch";
import { Option as OptionType } from "../lib/groupOptions";
import { RenderOptionCallback } from "./Options";

export type ButtonElementProps = {
  tabIndex: number;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: "on" | "off";
};

export type OptionProps = {
  optionProps: ButtonElementProps;
  highlighted: boolean;
  selected: boolean;
  option: OptionType;
  renderOption?: RenderOptionCallback;
  disabled?: boolean;
};

export const Option = memo(
  ({
    optionProps,
    highlighted,
    selected,
    option,
    renderOption,
    disabled,
  }: OptionProps) => {
    const props = {
      ...optionProps,
      value: encodeURIComponent(option.value),
      disabled,
    };
    const className = clsx({
      [`${BASE_CLASS}-option`]: true,
      [`${BASE_CLASS}-is-selected`]: selected,
      [`${BASE_CLASS}-is-highlighted`]: highlighted,
    });

    return (
      <li
        className={`${BASE_CLASS}-row`}
        role="menuitem"
        data-index={option.index}
      >
        {renderOption ? (
          renderOption(props, option, { selected, highlighted }, className)
        ) : (
          <button type="button" className={className} {...props}>
            {option.name}
          </button>
        )}
      </li>
    );
  },
);

Option.displayName = "Option";
