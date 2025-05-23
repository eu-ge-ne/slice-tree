export function for_exp(
  start: number,
  end: number,
  fn: (n: number) => void,
): void {
  for (let power = start; power < end; power += 1) {
    fn(10 ** power);
  }
}

export function str(n: number): string {
  let str = "";
  while (str.length < n) {
    str += crypto.randomUUID().slice(0, n - str.length);
  }
  return str;
}
