import { Option } from "./groupOptions";

type Query = string;

type Middleware = (data: Option[], query: Query) => Option[];

type ReducedResult = Array<Option>;

const isMiddleware: (v: Middleware | null) => v is Middleware = Boolean as any;

export function reduce(
  middleware: Array<Middleware | null>,
  options: Option[],
  query: Query,
): ReducedResult {
  return middleware
    .filter(isMiddleware)
    .reduce((data, cb) => cb(data, query), options)
    .map((item, i) => ({ ...item, index: i }));
}
