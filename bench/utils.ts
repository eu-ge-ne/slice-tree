export function str(n: number): string {
  let str = "";
  while (str.length < n) {
    str += crypto.randomUUID().slice(0, n - str.length);
  }
  return str;
}
