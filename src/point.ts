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
    let i = 0;
    let prev: string | undefined;
    for (const char of text) {
      if (char === "\n") {
        this.eol_starts.push(this.len + i - (prev === "\r" ? 1 : 0));
        this.eol_ends.push(this.len + i + 1);
      }
      prev = char;
      i += 1;
    }

    this.len += [...text].length;
    this.#text += text;
  }

  read(i: number, n: number): IteratorObject<string> {
    return this.#text[Symbol.iterator]().drop(i).take(n);
  }
}
