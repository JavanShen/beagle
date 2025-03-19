import { expect, test, describe } from "vitest";
import { generateRandomArray } from "../src/utils/array.ts";

describe("generateRandomArray", () => {
  test("生成指定长度的数组", () => {
    const array = generateRandomArray(5, 5);
    expect(array).toHaveLength(5);
  });

  test("数组不重复", () => {
    const array = generateRandomArray(5, 5);
    expect(array).toStrictEqual(Array.from(new Set(array)));
  });

  test("数组元素在指定范围内", () => {
    const array = generateRandomArray(5, 4);
    console.log(array);
    expect(array.every((num) => num >= 0 && num <= 5)).toBe(true);
  });
});
