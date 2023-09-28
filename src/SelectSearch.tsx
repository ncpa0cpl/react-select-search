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
  /**
   * Each object should contain a `name` and `value` property, at the very
   * least. Optionally the `type` can be set to "group" to mark the option as as
   * a group, in which case the `items` property should be set.
   */
  options: Option[];
  defaultValue?: string | string[];
  /**
   * Value of the currently selected option. The value should be an array if
   * multiple mode.
   */
  value?: string | string[];
  /** Set to true if you want to allow multiple selected options. */
  multiple?: boolean;
  /** Set to true to enable search functionality */
  search?: boolean;
  /** Disables all functionality */
  disabled?: boolean;
  /**
   * Displayed if no option is selected and/or when search field is focused with
   * empty value.
   */
  placeholder?: string;
  /** HTML ID on the top level element. */
  id?: string;
  /** Disables/Enables autoComplete functionality in search field. */
  autoComplete?: "on" | "off";
  /** Autofocus on select */
  autoFocus?: boolean;
  /** Class name of a list of class names to be applied to the container element. */
  className?: string | string[] | { [key: string]: boolean };
  /** Function to receive and handle value changes. */
  onChange?: OnChangeCallback;
  /**
   * Function to receive and handle focus events on the search field. This is
   * also the event you want to use when reacting to the select modal opening.
   */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * Function to receive and handle blur events on the search field. This is
   * also the event you want to use when reacting to the select modal closing.
   */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /**
   * When enabled, the dropdown modal will appear above the input, instead of
   * below it, order od options will also be reversed.
   */
  expandUpward?: boolean;
  /**
   * The selectbox will blur by default when selecting an option. Set this to
   * false to prevent this behavior.
   */
  closeOnSelect?: boolean;
  /** Function that renders the options elements. */
  renderOption?: RenderOptionCallback;
  /** Set to true to enable search functionality via fuzzy-find. */
  fuzzySearch?: boolean;
  /**
   * An array of functions that takes the last filtered options and a search
   * query if any. Runs after getOptions.
   */
  filterOptions?: FilterOptionGetter[];
  /** Function that renders the value/search field. */
  renderValue?: (
    valueProps: InputElementPops,
    snapshot: SelectorSnapshot,
    className: string,
  ) => React.ReactNode;
  /** Function that renders the group header. */
  renderGroupHeader?: RenderGroupHeaderCallback;
  /** Get options through a function call, can return a promise for async usage. */
  getOptions?: GetOptionsCallback;
  /** Number of ms to wait until calling get options when searching. */
  debounce?: number;
  /** Ref to the top level div element. */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Set empty message for empty options list, you can provide render function
   * without arguments instead plain string message
   */
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
        expandUpward,
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
        const { current: container } = selectRef;

        if (container) {
          const val = Array.isArray(snapValue) ? snapValue[0] : snapValue;
          if (val != null) {
            const selected = container.querySelector<HTMLElement>(
              highlighted > -1
                ? `[data-index="${highlighted}"]`
                : `[value="${encodeURIComponent(val)}"]`,
            );

            if (selected) {
              if (expandUpward) {
                selected.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              } else {
                selected.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
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
            [`${BASE_CLASS}-expand-upward`]: !!expandUpward,
            [`${BASE_CLASS}-expand-downward`]: !expandUpward,
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
                reverse={expandUpward}
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
