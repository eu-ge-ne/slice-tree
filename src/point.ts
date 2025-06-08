import { Buffer, BufferFactory } from "./buffer.ts";

export class PointBufferFactory extends BufferFactory {
  create(text: string): Buffer {
    return new PointBuffer(text);
  }
}

class PointBuffer extends Buffer {
  #text = "";

  constructor(text: string) {
    super();
    this.append(text);
  }

  append(text: string): void {
    this.#append_eols(text, this.len, this.eol_starts, this.eol_ends);
    this.len += [...text].length;
    this.#text += text;
  }

  read(index: number, n: number): IteratorObject<string> {
    return this.#text[Symbol.iterator]().drop(index).take(n);
  }

  #append_eols(
    text: string,
    index: number,
    starts: number[],
    ends: number[],
  ): void {
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
  }
}
