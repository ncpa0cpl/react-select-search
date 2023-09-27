import { Option } from "./groupOptions";
import { isSame } from "./isSame";

type Value = string | number;

export function getOption(value: undefined, options: Array<Option>): null;
export function getOption(value: Value, options: Array<Option>): null | Option;
export function getOption(
  value: Value[],
  options: Array<Option>,
): null | Option[];
export function getOption(
  value: Value | Array<Value> | undefined,
  options: Array<Option>,
): null | Option | Array<Option>;
export function getOption(
  value: Value | Array<Value> | undefined,
  options: Array<Option>,
): null | Option | Array<Option> {
  if (Array.isArray(value)) {
    return value
      .map((v) => options.find((o) => isSame(o.value, v)))
      .filter((o): o is Option => !!o);
  }

  return options.find((o) => isSame(o.value, value)) || null;
}
