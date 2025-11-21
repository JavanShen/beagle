import { expect, test, describe } from "vitest";
import {
  generateRandomArray,
  generateOrderedArray,
} from "../app/utils/array.ts";

describe("generateRandomArray", () => {
  test("should generate an array of specified length.", () => {
    const array = generateRandomArray(5, 10);
    expect(array).toHaveLength(5);
  });

  test("the array does not repeat(when the length is sufficient)", () => {
    const array = generateRandomArray(5, 4);
    expect(array).toStrictEqual(Array.from(new Set(array)));
  });

  test("array elements within the specified range", () => {
    const array = generateRandomArray(5, 4);
    expect(array.every((num) => num >= 0 && num <= 5)).toBe(true);
  });

  test("the array elements do not contain the specified element", () => {
    const array = generateRandomArray(5, 6, [2, 4]);
    expect(
      array.every((num) => num >= 0 && num <= 6 && ![2, 4].includes(num)),
    ).toBe(true);
  });

  test("Complete when the array length is insufficient", () => {
    const array = generateRandomArray(10, 4);
    expect(array).toHaveLength(10);
    expect(new Set(array.slice(0, 5))).toEqual(new Set([0, 1, 2, 3, 4]));
    expect(new Set(array.slice(5, 10))).toEqual(new Set([0, 1, 2, 3, 4]));
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
