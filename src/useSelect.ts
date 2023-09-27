import React, { useEffect, useRef, useState } from "react";
import { SelectSearchProps } from "./SelectSearch";
import { ButtonElementProps } from "./components/Option";
import { fuzzySearch } from "./lib/fuzzySearch";
import { getDisplayValue } from "./lib/getDisplayValue";
import { getOption } from "./lib/getOption";
import { getValue } from "./lib/getValue";
import { Option, OptionGroup, groupOptions } from "./lib/groupOptions";
import { reduce } from "./lib/reduce";
import { updateOption } from "./lib/updateOption";
import { useHighlight } from "./useHighlight";
import { GetOptionsCallback, useOptions } from "./useOptions";

export type InputOption = {
  name: string;
  value: string | number;
  type?: "item";
  disabled?: boolean;
  [key: string]: any;
};

export type InputOptionGroup = {
  name: string;
  type: "group";
  items: InputOption[];
  [key: string]: any;
};

export type OnChangeCallback = (
  value: string | number | (string | number)[] | null,
  options: Option | Option[] | null,
  optionSnapshot?: SelectSearchProps,
) => void;

export type FilterOptionGetter = (options: Option[], query: string) => Option[];

export type UseSelectParams = {
  options: Array<InputOption | InputOptionGroup>;
  defaultValue?: string | string[];
  value?: string | string[];
  multiple?: boolean;
  search?: boolean;
  onChange?: OnChangeCallback;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  closeOnSelect?: boolean;
  placeholder?: string;
  getOptions?: GetOptionsCallback;
  filterOptions?: FilterOptionGetter[];
  useFuzzySearch?: boolean;
  debounce: number;
};

export type SelectorSnapshot = {
  value: string | number | (string | number)[] | null;
  highlighted: number;
  displayValue: string;
  focus: boolean;
  fetching: boolean;
  search: string;
  options: (Option | OptionGroup)[];
  option: Option | Option[] | null;
};

export type InputElementPops = {
  tabIndex: number;
  readOnly?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  value: string;
  ref: React.RefObject<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyUp: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onMouseDown: React.MouseEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const noop = () => {};

export function useSelect({
  options: defaultOptions,
  defaultValue,
  value,
  multiple,
  search,
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
  closeOnSelect = true,
  placeholder,
  getOptions,
  filterOptions,
  useFuzzySearch = true,
  debounce,
}: UseSelectParams) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [option, setOption] = useState<null | Option | Option[]>(null);
  const [q, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [options, fetching] = useOptions(
    defaultOptions,
    getOptions,
    debounce,
    q,
  );

  const onSelect = (v: string | number) => {
    const newOpt = getOption(decodeURIComponent(String(v)), options);
    const newOption = updateOption(newOpt, option, multiple);

    if (value === undefined) {
      setOption(newOption);
    }

    onChange(getValue(newOption), newOption);

    setTimeout(() => {
      if (ref.current && closeOnSelect) {
        ref.current.blur();
      }
    }, 0);
  };

  const middleware = [
    useFuzzySearch ? fuzzySearch : null,
    ...(filterOptions ? filterOptions : []),
  ];

  const filteredOptions = groupOptions(reduce(middleware, options, q));

  const [keyHandlers, highlighted, setHighlighted] = useHighlight(
    filteredOptions,
    onSelect,
    ref,
  );

  const snapshot: SelectorSnapshot = {
    search: q,
    focus,
    option,
    value: getValue(option),
    fetching,
    highlighted,
    options: filteredOptions,
    displayValue: getDisplayValue(option, options, placeholder),
  };

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocus(true);
    onFocus(e);
  };

  const blurHandler: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocus(false);
    setSearch("");
    setHighlighted(-1);
    onBlur(e);
  };

  const mouseDownHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (focus) {
      e.preventDefault();
      ref.current?.blur();
    }
  };

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const mouseDownHandler2: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onSelect((e.currentTarget as HTMLInputElement).value);
  };

  const valueProps: InputElementPops = {
    tabIndex: 0,
    readOnly: !search,
    placeholder,
    value: focus && search ? q : snapshot.displayValue,
    ref,
    ...keyHandlers,
    onFocus: focusHandler,
    onBlur: blurHandler,
    onMouseDown: mouseDownHandler,
    onChange: search ? changeHandler : undefined,
  };

  const optionProps: ButtonElementProps = {
    tabIndex: -1,
    onMouseDown: mouseDownHandler2,
  };

  useEffect(() => {
    if (value === undefined) {
      setOption(getOption(defaultValue, options));
    } else {
      setOption(getOption(value, options));
    }
  }, [value, options]);

  return [snapshot, valueProps, optionProps] as const;
}
