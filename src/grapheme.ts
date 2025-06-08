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
    this.#append_eols(text, this.len, this.eol_starts, this.eol_ends);
    this.len += [...this.#segmenter.segment(text)].length;
    this.#text += text;
  }

  read(index: number, count: number): IteratorObject<string> {
    return this.#segmenter.segment(this.#text)[Symbol.iterator]().drop(index)
      .take(count).map((x) => x.segment);
  }

  #append_eols(
    text: string,
    index: number,
    starts: number[],
    ends: number[],
  ): void {
    let i = 0;

    for (const { segment } of this.#segmenter.segment(text)) {
      if (segment === "\n" || segment === "\r\n") {
        starts.push(index + i);
        ends.push(index + i + segment.length);
      }

      i += 1;
    }
  }
}
