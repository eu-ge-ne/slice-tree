import type { Reader } from "./reader.ts";

export interface Buffer {
  readonly reader: Reader;
  text: string;
  len: number;
  eols_i0: number[];
  eols_i1: number[];
}

export function new_buffer(reader: Reader, text: string): Buffer {
  const buf: Buffer = {
    reader,
    text,
    len: reader.len(text),
    eols_i0: [],
    eols_i1: [],
  };

  reader.eols(text, 0, buf.eols_i0, buf.eols_i1);

  return buf;
}

export function grow_buffer(x: Buffer, text: string): void {
  x.reader.eols(text, x.len, x.eols_i0, x.eols_i1);

  x.len = x.reader.len(text);
  x.text += text;
}

export function find_eol(x: Buffer, eols_start: number, index: number): number {
  let a = eols_start;
  let b = x.eols_i0.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = x.eols_i0[i]!;

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
