/* eslint-disable react/prop-types */
import React, { memo } from "react";
import { BASE_CLASS } from "../SelectSearch";
import { OptionGroup, Option as OptionType } from "../lib/groupOptions";
import { isSelected } from "../lib/isSelected";
import { SelectorSnapshot } from "../useSelect";
import { ButtonElementProps, Option } from "./Option";

export type SelectedOptionValue = string | number;

export type Snapshot = {
  highlighted: number;
  option: OptionType | Array<OptionType>;
};

export type OptionSnapshot = {
  selected: boolean;
  highlighted: boolean;
};

export type RenderOptionCallback = (
  domProps: ButtonElementProps,
  option: OptionType,
  snapshot: OptionSnapshot,
  className: string,
) => React.ReactNode;

export type RenderGroupHeaderCallback = (name: string) => string;

export type OptionListProps = {
  reverse?: boolean;
  options: Array<OptionType | OptionGroup>;
  renderOption?: RenderOptionCallback;
  renderGroupHeader?: RenderGroupHeaderCallback;
  optionProps: ButtonElementProps;
  snapshot: SelectorSnapshot;
  disabled?: boolean;
};

export const Options = memo((props: OptionListProps) => {
  const {
    options,
    renderOption,
    renderGroupHeader,
    optionProps,
    snapshot,
    disabled,
    reverse,
  } = props;

  const optionsElements: JSX.Element[] = [];

  const renderOptionElement = (o: OptionType | OptionGroup) => {
    if (o.type === "group") {
      return (
        <li role="none" className={`${BASE_CLASS}-row`} key={o.name}>
          <div className={`${BASE_CLASS}-group`}>
            <div className={`${BASE_CLASS}-group-header`}>
              {renderGroupHeader ? renderGroupHeader(o.name) : o.name}
            </div>
            <Options {...props} options={o.items} />
          </div>
        </li>
      );
    }

    return (
      <Option
        key={o.value}
        option={o}
        optionProps={optionProps}
        renderOption={renderOption}
        selected={isSelected(o, snapshot.option)}
        highlighted={snapshot.highlighted === o.index}
        disabled={o.disabled || disabled}
      />
    );
  };

  if (reverse) {
    for (let i = options.length - 1; i >= 0; i--) {
      optionsElements.push(renderOptionElement(options[i]!));
    }
  } else {
    for (let i = 0; i < options.length; i++) {
      optionsElements.push(renderOptionElement(options[i]!));
    }
  }

  return <ul className={`${BASE_CLASS}-options`}>{optionsElements}</ul>;
});

Options.displayName = "Options";
