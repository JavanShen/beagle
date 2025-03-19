import { expect, test, describe } from "vitest";
import { generateRandomArray } from "../src/utils/array.ts";

describe("generateRandomArray", () => {
  test("生成指定长度的数组", () => {
    const array = generateRandomArray(5, 10);
    expect(array).toHaveLength(5);
  });

  test("数组不重复", () => {
    const array = generateRandomArray(5, 4);
    expect(array).toStrictEqual(Array.from(new Set(array)));
  });

  test("数组元素在指定范围内", () => {
    const array = generateRandomArray(5, 4);
    expect(array.every((num) => num >= 0 && num <= 5)).toBe(true);
  });

  test("数组元素不包含指定元素", () => {
    const array = generateRandomArray(5, 6, [2, 4]);
    expect(
      array.every((num) => num >= 0 && num <= 6 && ![2, 4].includes(num)),
    ).toBe(true);
  });
});
