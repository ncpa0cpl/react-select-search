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
  } = props;

  return (
    <ul className={`${BASE_CLASS}-options`}>
      {options.map((o) => {
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
      })}
    </ul>
  );
});

Options.displayName = "Options";
