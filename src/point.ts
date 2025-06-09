import { Buffer, BufferFactory } from "./buffer.ts";

export class PointBufferFactory extends BufferFactory {
  #index_step: number;

  constructor(index_step: number) {
    super();

    this.#index_step = index_step;
  }

  create(text: string): Buffer {
    return new PointBuffer(this.#index_step, text);
  }
}

class PointBuffer extends Buffer {
  #index_step: number;
  #text = "";
  #index: number[] = [];

  constructor(index_step: number, text: string) {
    super();

    this.#index_step = index_step;

    this.append(text);
  }

  append(text: string): void {
    let prev: string | undefined;
    let index = 0;

    for (const char of text) {
      if (char === "\n") {
        this.eol_starts.push(this.len - (prev === "\r" ? 1 : 0));
        this.eol_ends.push(this.len + 1);
      }

      prev = char;

      if (this.len % this.#index_step === 0) {
        this.#index.push(this.#text.length + index);
      }

      this.len += 1;
      index += char.length;
    }

    this.#text += text;
  }

  *read(index: number, count: number): Generator<string> {
    const text = this.#text.slice(
      this.#index[Math.trunc(index / this.#index_step)],
    );

    let i = index % this.#index_step;

    for (const char of text) {
      if (count === 0) {
        break;
      }

      if (i > 0) {
        i -= 1;
      } else {
        yield char;

        count -= 1;
      }
    }
  }
}
