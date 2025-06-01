export function count_chars(text: string): number {
  /*
  let char_count = 0;
  for (const _ of text) {
    char_count += 1;
  }
  return char_count;
  */

  return [...text].length;
}
