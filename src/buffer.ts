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

  slice(start: number, end: number): IteratorObject<string> {
    return this.#text[Symbol.iterator]().drop(start).take(end - start);
  }
}
