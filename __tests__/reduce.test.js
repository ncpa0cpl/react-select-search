import { flattenOptions } from "../src/lib/flattenOptions";
import { reduce } from "../src/lib/reduce";
import { countries } from "./data";

const options = flattenOptions(countries);

describe("Unit test for reduce function", () => {
  test("Can search", () => {
    const middleware = [
      (items, query) =>
        items.filter((option) => option.name.indexOf(query) >= 0),
      (items) => items.slice(0, 3),
    ];

    const filteredOptions = reduce(middleware, options, "land");

    expect(filteredOptions[0].value).toEqual("AX");
    expect(filteredOptions.length).toEqual(3);
  });
});
