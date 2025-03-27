import { expect, test, describe } from "vitest";
import {
  generateRandomArray,
  generateOrderedArray,
} from "../src/utils/array.ts";

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

describe("generateOrderedArray", () => {
  test("should generate an ordered array of the correct length", () => {
    expect(generateOrderedArray(5)).toEqual([0, 1, 2, 3, 4]);
  });

  test("should start from the specified start number", () => {
    expect(generateOrderedArray(5, 10)).toEqual([10, 11, 12, 13, 14]);
  });

  test("should not exceed the max value when loop is false", () => {
    expect(generateOrderedArray(5, 10, 12)).toEqual([10, 11]);
  });

  test("should wrap around when loop is true", () => {
    expect(generateOrderedArray(5, 2, 3, true)).toEqual([2, 0, 1, 2, 0]);
  });
});
