import { add_eols, type EOL } from "./eol.ts";

export class Buffer {
  #text: string;
  char_count: number;
  readonly eols: EOL[] = [];

  constructor(text: string) {
    this.#text = text;
    this.char_count = [...text].length;
    add_eols(this.eols, text);
  }

  append(text: string): void {
    add_eols(this.eols, text, this.char_count);

    this.#text += text;
    this.char_count += [...text].length;
  }

  slice(start: number, end: number): string {
    let i = 0;
    let a = 0;
    let b = 0;

    for (const char of this.#text) {
      if (i < start) {
        a += char.length;
        i += 1;
      } else if (i < end) {
        b += char.length;
        i += 1;
      } else {
        break;
      }
    }

    return this.#text.slice(a, a + b);
  }
}
