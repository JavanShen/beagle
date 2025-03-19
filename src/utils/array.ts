export const generateOrderedArray = (length: number, start: number = 0) => {
  const arr = [];
  for (let i = start; i < length; i++) {
    arr.push(i);
  }
  return arr;
};

export const generateRandomArray = (length: number, max: number) => {
  if (length > max + 1) return [];
  const arr = Array.from({ length: max + 1 }, (_, i) => i);
  for (let i = 0; i < length; i++) {
    const j = i + Math.floor(Math.random() * (max + 1 - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, length);
};
