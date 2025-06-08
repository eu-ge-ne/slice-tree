import { Buffer, BufferFactory } from "./buffer.ts";

const INDEX_STEP = 1;

export class GraphemeBufferFactory extends BufferFactory {
  seg = new Intl.Segmenter();

  create(text: string): Buffer {
    return new GraphemeBuffer(text, this.seg);
  }
}

class GraphemeBuffer extends Buffer {
  #seg: Intl.Segmenter;
  #text = "";
  #index: number[] = [];

  constructor(text: string, seg: Intl.Segmenter) {
    super();

    this.#seg = seg;

    this.append(text);
  }

  append(text: string): void {
    for (const { segment, index } of this.#seg.segment(text)) {
      if (segment === "\n" || segment === "\r\n") {
        this.eol_starts.push(this.len);
        this.eol_ends.push(this.len + segment.length);
      }

      this.len += 1;

      if (this.len % INDEX_STEP === 0) {
        this.#index.push(this.#text.length + index);
      }
    }

    this.#text += text;
  }

  read(i: number, n: number): IteratorObject<string> {
    const text = this.#text.slice(this.#index[Math.trunc(i / INDEX_STEP)]!);

    return this.#seg.segment(text)[Symbol.iterator]().drop(i % INDEX_STEP)
      .take(n).map((x) => x.segment);
  }
}
