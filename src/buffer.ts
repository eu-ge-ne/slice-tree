export class Buffer {
  #text: string;

  length: number;
  eol_starts: number[] = [];
  eol_ends: number[] = [];

  constructor(text: string) {
    this.#text = text;
    this.length = [...text].length;

    this.#add_eols(text);
  }

  append(text: string): void {
    this.#add_eols(text, this.length);

    this.#text += text;
    this.length += [...text].length;
  }

  read(start: number, count: number): IteratorObject<string> {
    return this.#text[Symbol.iterator]().drop(start).take(count);
  }

  find_eol(eols_start: number, index: number): number {
    let a = eols_start;
    let b = this.eol_starts.length - 1;
    let i = 0;
    let v = 0;

    while (a <= b) {
      i = Math.trunc((a + b) / 2);
      v = this.eol_starts[i]!;

      if (v < index) {
        a = i + 1;
      } else if (v > index) {
        b = i - 1;
      } else {
        a = i;
        break;
      }
    }

    return a;
  }

  #add_eols(text: string, start = 0): void {
    let i = 0;
    let prev: string | undefined;

    for (const char of text) {
      if (char === "\n") {
        this.eol_starts.push(start + i - (prev === "\r" ? 1 : 0));
        this.eol_ends.push(start + i + 1);
      }

      prev = char;
      i += 1;
    }
  }
}
