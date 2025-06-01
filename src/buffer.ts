import { add_eols, type EOL } from "./eol.ts";
import { count_chars } from "./unicode.ts";

export class Buffer {
  #text: string;
  char_count: number;
  readonly eols: EOL[] = [];

  constructor(text: string) {
    this.#text = text;
    this.char_count = count_chars(text);
    add_eols(this.eols, text);
  }

  append(text: string): void {
    add_eols(this.eols, text, this.char_count);
    this.#text += text;
    this.char_count += count_chars(text);
  }

  slice(start: number, end: number): string {
    let i = 0;

    let s = 0;
    for (const char of this.#text) {
      if (i === start) {
        break;
      }
      i += 1;
      s += char.length;
    }

    const t = this.#text.slice(s);

    i = 0;

    let e = 0;
    for (const char of t) {
      if (i === (end - start)) {
        break;
      }
      i += 1;
      e += char.length;
    }

    return t.slice(0, e);
  }
}
