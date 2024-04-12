export function getRand(arr: [number, number]) {
  const newArr = [...arr];
  newArr.sort((a, b) => a - b);
  return Math.floor(Math.random() * (newArr[1] - newArr[0]) + newArr[0]);
}
