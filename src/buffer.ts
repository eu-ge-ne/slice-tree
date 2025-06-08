export abstract class BufferFactory {
  abstract create(text: string): Buffer;
}

export abstract class Buffer {
  len = 0;
  eol_starts: number[] = [];
  eol_ends: number[] = [];

  abstract append(text: string): void;
  abstract read(index: number, n: number): IteratorObject<string>;

  find_eol(a: number, index: number): number {
    let b = this.eol_starts.length - 1;
    let i = 0;
    let v = 0;

    while (a <= b) {
      i = Math.trunc((a + b) / 2);
      v = this.eol_starts[i]!;

      if (v < index) {
        a = i + 1;
      } else if (v > index) {
        b = i - 1;
      } else {
        a = i;
        break;
      }
    }

    return a;
  }
}

export class GraphemeBuffer extends Buffer {
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

export class GraphemeBufferFactory extends BufferFactory {
  segmenter = new Intl.Segmenter();

  create(text: string): Buffer {
    return new GraphemeBuffer(text, this.segmenter);
  }
}
