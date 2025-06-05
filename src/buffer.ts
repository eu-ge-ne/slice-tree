import type { Reader } from "./reader.ts";

export interface Buffer {
  readonly reader: Reader;
  text: string;
  len: number;
  eol_starts: number[];
  eol_ends: number[];
}

export function new_buffer(reader: Reader, text: string): Buffer {
  const buf: Buffer = {
    reader,
    text,
    len: reader.len(text),
    eol_starts: [],
    eol_ends: [],
  };

  reader.eols(text, 0, buf.eol_starts, buf.eol_ends);

  return buf;
}

export function grow_buffer(buf: Buffer, text: string): void {
  buf.reader.eols(text, buf.len, buf.eol_starts, buf.eol_ends);

  buf.len = buf.reader.len(text);
  buf.text += text;
}

export function find_eol(
  buf: Buffer,
  eols_start: number,
  index: number,
): number {
  let a = eols_start;
  let b = buf.eol_starts.length - 1;
  let i = 0;
  let v = 0;

  while (a <= b) {
    i = Math.trunc((a + b) / 2);
    v = buf.eol_starts[i]!;

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
