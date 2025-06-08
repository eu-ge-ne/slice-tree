import { Buffer, BufferFactory } from "./buffer.ts";

export class GraphemeBufferFactory extends BufferFactory {
  segmenter = new Intl.Segmenter();

  create(text: string): Buffer {
    return new GraphemeBuffer(text, this.segmenter);
  }
}

class GraphemeBuffer extends Buffer {
  #segmenter: Intl.Segmenter;
  #text = "";

  constructor(text: string, segmenter: Intl.Segmenter) {
    super();

    this.#segmenter = segmenter;

    this.append(text);
  }

  append(text: string): void {
    let i = 0;
    for (const { segment } of this.#segmenter.segment(text)) {
      if (segment === "\n" || segment === "\r\n") {
        this.eol_starts.push(this.len + i);
        this.eol_ends.push(this.len + i + segment.length);
      }
      i += 1;
    }

    this.len += [...this.#segmenter.segment(text)].length;
    this.#text += text;
  }

  read(i: number, n: number): IteratorObject<string> {
    return this.#segmenter.segment(this.#text)[Symbol.iterator]().drop(i)
      .take(n).map((x) => x.segment);
  }
}
