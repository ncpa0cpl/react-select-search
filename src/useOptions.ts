import { useEffect, useState } from "react";
import { flattenOptions } from "./lib/flattenOptions";
import { Option, OptionGroup } from "./lib/groupOptions";
import { InputOption, InputOptionGroup } from "./useSelect";

export type GetOptionsCallback = (
  search: string,
  options: Array<Option | OptionGroup>,
) => Promise<Array<Option | OptionGroup>> | Array<Option | OptionGroup>;

export function useOptions(
  defaultOptions: Array<InputOption | InputOptionGroup>,
  getOptions: GetOptionsCallback | undefined,
  debounceTime: number,
  search: string,
) {
  const [options, setOptions] = useState(() => flattenOptions(defaultOptions));
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!getOptions) {
      return;
    }

    timeout = setTimeout(async () => {
      setFetching(true);
      const newOptions = await getOptions(search, options);
      setOptions(flattenOptions(newOptions));
      setFetching(false);
    }, debounceTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    setOptions(flattenOptions(defaultOptions));
  }, [defaultOptions]);

  return [options, fetching] as const;
}
