export const generateOrderedArray = (
  length: number,
  start: number = 0,
  max: number = Infinity,
  loop: boolean = false,
) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    if (start + i >= max && !loop) break;
    arr.push(loop ? (start + i) % max : start + i);
  }
  return arr;
};

export const generateRandomArray = (
  length: number,
  max: number,
  exclude: number[] = [],
) => {
  if (length > max + 1 - exclude.length) return [];
  const arr = Array.from({ length: max + 1 }, (_, i) => i).filter(
    (i) => !exclude.includes(i),
  );
  for (let i = 0; i < length; i++) {
    const j = i + Math.floor(Math.random() * (max + 1 - exclude.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, length);
};
