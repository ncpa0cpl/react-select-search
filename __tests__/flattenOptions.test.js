import { flattenOptions } from "../src/lib/flattenOptions";

describe("Unit test for FlattenOptions function", () => {
  const groupedOptions = [
    {
      type: "group",
      name: "Cursive",
      items: [
        {
          name: "Monoton",
          value: "Monoton",
        },
      ],
    },
    {
      name: "Gloria Hallelujah",
      value: "Gloria Hallelujah",
    },
  ];

  const result = flattenOptions(groupedOptions);

  test("Has correct items", () => {
    expect(result).toHaveLength(2);
  });

  test("First item should be a group", () => {
    expect("group" in result[0]).toEqual(true);
  });

  test("Second item should not be a group", () => {
    expect("group" in result[1]).toEqual(false);
  });
});
