import { Buffer, BufferFactory } from "./buffer.ts";

export class UnitBufferFactory extends BufferFactory {
  regexp = /\r?\n/gm;

  create(text: string): Buffer {
    return new UnitBuffer(text, this.regexp);
  }
}

class UnitBuffer extends Buffer {
  #regexp: RegExp;
  #text = "";

  constructor(text: string, regexp: RegExp) {
    super();
    this.#regexp = regexp;
    this.append(text);
  }

  append(text: string): void {
    for (const x of text.matchAll(this.#regexp)) {
      this.eol_starts.push(this.len + x.index);
      this.eol_ends.push(this.len + x.index + x[0].length);
    }

    this.len += text.length;
    this.#text += text;
  }

  read(i: number, n: number): IteratorObject<string> {
    return this.#text.slice(i, i + n)[Symbol.iterator]();
  }
}
