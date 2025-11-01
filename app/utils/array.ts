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
  const actualLen = max + 1 - exclude.length;
  const splitNum = Math.ceil(length / actualLen);
  let ans: number[] = [];

  for (let count = 1; count <= splitNum; count++) {
    const len =
      length > actualLen
        ? count * actualLen <= length
          ? actualLen
          : length - actualLen
        : length;

    const arr = Array.from({ length: max + 1 }, (_, i) => i).filter(
      (i) => !exclude.includes(i),
    );
    for (let i = 0; i < len; i++) {
      const j = i + Math.floor(Math.random() * (actualLen - i));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    ans = [...ans, ...arr.slice(0, len)];
  }

  return ans;
};
