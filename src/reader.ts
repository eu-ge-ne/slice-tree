export interface Reader {
  len(text: string): number;
  read(text: string, index: number, count: number): IteratorObject<string>;
  eols(text: string, index: number, starts: number[], ends: number[]): void;
}

export function new_unit_reader(): Reader {
  const EOL_RE = /\r?\n/gm;

  return {
    len(text: string): number {
      return text.length;
    },

    read(text: string, index: number, count: number): IteratorObject<string> {
      return text.slice(index, index + count)[Symbol.iterator]();
    },

    eols(text: string, index: number, starts: number[], ends: number[]): void {
      for (const x of text.matchAll(EOL_RE)) {
        starts.push(index + x.index);
        ends.push(index + x.index + x[0].length);
      }
    },
  };
}

export function new_point_reader(): Reader {
  return {
    len(text: string): number {
      return [...text].length;
    },

    read(text: string, index: number, count: number): IteratorObject<string> {
      return text[Symbol.iterator]().drop(index).take(count);
    },

    eols(text: string, index: number, starts: number[], ends: number[]): void {
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
    },
  };
}

export function new_grapheme_reader(): Reader {
  const segmenter = new Intl.Segmenter();

  return {
    len(text: string): number {
      return [...segmenter.segment(text)].length;
    },

    read(text: string, index: number, count: number): IteratorObject<string> {
      return segmenter.segment(text)[Symbol.iterator]().drop(index).take(count)
        .map((x) => x.segment);
    },

    eols(text: string, index: number, starts: number[], ends: number[]): void {
      let i = 0;

      for (const { segment } of segmenter.segment(text)) {
        if (segment === "\n" || segment === "\r\n") {
          starts.push(index + i);
          ends.push(index + i + segment.length);
        }

        i += 1;
      }
    },
  };
}
