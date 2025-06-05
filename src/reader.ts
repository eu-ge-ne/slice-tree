export interface Reader {
  len(text: string): number;
  read(text: string, index: number, count: number): IteratorObject<string>;
  eols(text: string, index: number, starts: number[], ends: number[]): void;
}

export const code_point_reader: Reader = {
  len(text: string): number {
    return [...text].length;
  },

  read(text: string, index: number, count: number): IteratorObject<string> {
    return text[Symbol.iterator]().drop(index).take(count);
  },

  eols(text: string, index: number, starts: number[], ends: number[]): void {
    let i = 0;
    let prev: string | undefined;

    for (const char of text) {
      if (char === "\n") {
        starts.push(index + i - (prev === "\r" ? 1 : 0));
        ends.push(index + i + 1);
      }

      prev = char;
      i += 1;
    }
  },
};
