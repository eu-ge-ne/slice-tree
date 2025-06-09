import { Buffer, BufferFactory } from "./buffer.ts";

export class GraphemeBufferFactory extends BufferFactory {
  #seg = new Intl.Segmenter();
  #index_step: number;

  constructor(index_step: number) {
    super();

    this.#index_step = index_step;
  }

  create(text: string): Buffer {
    return new GraphemeBuffer(this.#seg, this.#index_step, text);
  }
}

class GraphemeBuffer extends Buffer {
  #seg: Intl.Segmenter;
  #index_step: number;
  #text = "";
  #index: number[] = [];

  constructor(seg: Intl.Segmenter, index_step: number, text: string) {
    super();

    this.#seg = seg;
    this.#index_step = index_step;

    this.append(text);
  }

  append(text: string): void {
    for (const { segment, index } of this.#seg.segment(text)) {
      if (segment === "\n" || segment === "\r\n") {
        this.eol_starts.push(this.len);
        this.eol_ends.push(this.len + 1);
      }

      if (this.len % this.#index_step === 0) {
        this.#index.push(this.#text.length + index);
      }

      this.len += 1;
    }

    this.#text += text;
  }

  *read(index: number, count: number): Generator<string> {
    const text = this.#text.slice(
      this.#index[Math.trunc(index / this.#index_step)],
    );

    let i = index % this.#index_step;

    for (const { segment } of this.#seg.segment(text)) {
      if (count === 0) {
        break;
      }

      if (i > 0) {
        i -= 1;
      } else {
        yield segment;

        count -= 1;
      }
    }
  }
}
