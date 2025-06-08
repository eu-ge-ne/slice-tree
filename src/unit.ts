import { Buffer, BufferFactory } from "./buffer.ts";

export class UnitBufferFactory extends BufferFactory {
  regexp = /\r?\n/gm;

  create(text: string): Buffer {
    return new UnitBuffer(text, this.regexp);
  }
}

export class UnitBuffer extends Buffer {
  #regexp: RegExp;
  #text = "";

  constructor(text: string, regexp: RegExp) {
    super();
    this.#regexp = regexp;
    this.append(text);
  }

  append(text: string): void {
    this.#append_eols(text, this.len, this.eol_starts, this.eol_ends);
    this.len += text.length;
    this.#text += text;
  }

  read(index: number, n: number): IteratorObject<string> {
    return this.#text.slice(index, index + n)[Symbol.iterator]();
  }

  #append_eols(
    text: string,
    index: number,
    starts: number[],
    ends: number[],
  ): void {
    for (const x of text.matchAll(this.#regexp)) {
      starts.push(index + x.index);
      ends.push(index + x.index + x[0].length);
    }
  }
}
