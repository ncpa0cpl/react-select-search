import clsx from "clsx";
import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import {
  Options,
  RenderGroupHeaderCallback,
  RenderOptionCallback,
} from "./components/Options";
import { Option } from "./lib/groupOptions";
import { GetOptionsCallback } from "./useOptions";
import {
  FilterOptionGetter,
  InputElementPops,
  OnChangeCallback,
  SelectorSnapshot,
  useSelect,
} from "./useSelect";

export type SelectSearchProps = {
  options: Option[];
  defaultValue?: string | string[];
  value?: string | string[];
  multiple?: boolean;
  search?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
  autoComplete?: "on" | "off";
  autoFocus?: boolean;
  className?: string | string[] | { [key: string]: boolean };
  onChange?: OnChangeCallback;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  closeOnSelect?: boolean;
  renderOption?: RenderOptionCallback;
  fuzzySearch?: boolean;
  filterOptions?: FilterOptionGetter[];
  renderValue?: (
    valueProps: InputElementPops,
    snapshot: SelectorSnapshot,
    className: string,
  ) => React.ReactNode;
  renderGroupHeader?: RenderGroupHeaderCallback;
  getOptions?: GetOptionsCallback;
  debounce?: number;
  ref?: React.Ref<React.Component>;
  emptyMessage?: React.ReactNode | (() => React.ReactNode);
};

export const BASE_CLASS = "select-search";

export const SelectSearch = memo(
  forwardRef<HTMLDivElement, SelectSearchProps>(
    (
      {
        options = [],
        disabled,
        placeholder,
        multiple,
        search,
        autoFocus,
        autoComplete = "on",
        id,
        closeOnSelect = true,
        className,
        renderValue,
        renderOption,
        renderGroupHeader,
        fuzzySearch = true,
        emptyMessage,
        value,
        debounce = 250,
        ...hookProps
      }: SelectSearchProps,
      ref,
    ) => {
      const selectRef = useRef<HTMLDivElement | null>(null);
      const [controlledValue, setControlledValue] = useState(value);
      const [snapshot, valueProps, optionProps] = useSelect({
        value: controlledValue,
        options,
        placeholder,
        multiple,
        search,
        closeOnSelect: closeOnSelect && !multiple,
        useFuzzySearch: fuzzySearch,
        debounce,
        defaultValue: hookProps.defaultValue,
        filterOptions: hookProps.filterOptions,
        getOptions: hookProps.getOptions,
        onBlur: hookProps.onBlur,
        onChange: hookProps.onChange,
        onFocus: hookProps.onFocus,
      });
      const { highlighted, value: snapValue, fetching, focus } = snapshot;

      const props: InputElementPops = {
        ...valueProps,
        autoFocus,
        autoComplete,
        disabled,
      };

      useEffect(() => {
        const { current } = selectRef;

        if (current) {
          const val = Array.isArray(snapValue) ? snapValue[0] : snapValue;
          if (val != null) {
            const selected = current.querySelector<HTMLElement>(
              highlighted > -1
                ? `[data-index="${highlighted}"]`
                : `[value="${encodeURIComponent(val)}"]`,
            );

            if (selected) {
              const rect = current.getBoundingClientRect();
              const selectedRect = selected.getBoundingClientRect();

              current.scrollTop =
                selected.offsetTop - rect.height / 2 + selectedRect.height / 2;
            }
          }
        }
      }, [snapValue, highlighted, selectRef.current]);

      useEffect(() => setControlledValue(value), [value]);

      return (
        <div
          ref={ref}
          id={id}
          className={clsx(`${BASE_CLASS}-container`, className, {
            [`${BASE_CLASS}-is-multiple`]: multiple,
            [`${BASE_CLASS}-is-disabled`]: disabled,
            [`${BASE_CLASS}-is-loading`]: fetching,
            [`${BASE_CLASS}-has-focus`]: focus,
          })}
        >
          {(!multiple || placeholder || search) && (
            <div className={`${BASE_CLASS}-value`}>
              {renderValue &&
                renderValue(props, snapshot, `${BASE_CLASS}-input`)}
              {!renderValue && (
                <input {...props} className={`${BASE_CLASS}-input`} />
              )}
            </div>
          )}
          <div
            className={`${BASE_CLASS}-select`}
            ref={selectRef}
            onMouseDown={(e) => e.preventDefault()}
          >
            {snapshot.options.length > 0 && (
              <Options
                options={snapshot.options}
                optionProps={optionProps}
                renderOption={renderOption}
                renderGroupHeader={renderGroupHeader}
                disabled={disabled}
                snapshot={snapshot}
              />
            )}
            {!snapshot.options.length && (
              <ul className={`${BASE_CLASS}-options`}>
                {!snapshot.options.length && emptyMessage && (
                  <li className={`${BASE_CLASS}-not-found`}>
                    {typeof emptyMessage === "function"
                      ? emptyMessage()
                      : emptyMessage}
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      );
    },
  ),
);

SelectSearch.displayName = "SelectSearch";
